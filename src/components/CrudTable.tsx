'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import styles from './CrudTable.module.css';

export type Column<T> = {
    key: keyof T;
    label: string;
    editable?: boolean;
    type?: 'boolean';
    options?:
        | { value: any; label: string }[]
        | { fromTable: string; valueKey: string; labelKey: string };
    render?: (value: any, row: T, refresh: () => void) => React.ReactNode;
};

type CrudTableProps<T> = {
    table: string;
    definitions: { orderBy: string; columns: Column<T>[] };
    uniqueKey: keyof T;
    bucket?: string;
    imageColumns?: { pathKey: keyof T; urlKey: keyof T };
};

export function CrudTable<T extends Record<string, any>>({
                                                             table,
                                                             definitions,
                                                             uniqueKey,
                                                             bucket,
                                                             imageColumns,
                                                         }: CrudTableProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<any | 'new' | null>(null);
    const [formValues, setFormValues] = useState<Partial<T>>({});
    const [optionsMap, setOptionsMap] = useState<Record<string, { value: any; label: string }[]>>({});

    const refresh = async () => {
        setLoading(true);
        const {data, error} = await supabase.from(table).select('*').order(definitions.orderBy, {ascending: true});
        if (error) setError(error.message);
        else setRows(data || []);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
    }, [table]);

    useEffect(() => {
        const missingTables = definitions.columns
            .filter(col => col.options && !Array.isArray(col.options))
            .map(col => (col.options as any).fromTable)
            .filter(fromTable => !optionsMap[fromTable]);

        missingTables.forEach(fromTable => {
            const col = definitions.columns.find(c => {
                const o = c.options;
                return o && !Array.isArray(o) && o.fromTable === fromTable;
            });
            if (!col || !col.options || Array.isArray(col.options)) return;

            const {valueKey, labelKey} = col.options;
            supabase
                .from(fromTable)
                .select(`${valueKey},${labelKey}`)
                .then(({data, error}) => {
                    if (!error && data) {
                        setOptionsMap(prev => ({
                            ...prev,
                            [fromTable]: data.map(row => ({
                                value: (row as any)[valueKey],
                                label: (row as any)[labelKey],
                            })),
                        }));
                    }
                });
        });
    }, [definitions.columns, optionsMap]);

    const insert = async (newRow: Partial<T>) => {
        const {data, error} = await supabase.from(table).insert(newRow).select();
        if (error) throw error;
        return data![0];
    };

    const updateRow = async (id: any, updates: Partial<T>) => {
        const {data, error} = await supabase.from(table).update(updates).eq(String(uniqueKey), String(id)).select();
        if (error) throw error;
        return data![0];
    };
    const confirmAndDelete = async (id: any) => {
        const confirmed = window.confirm('Are you sure you want to delete this row?');
        if (confirmed) {
            await deleteRow(id);
            await refresh();
        }
    };

    const deleteRow = async (id: any) => {
        const {error} = await supabase.from(table).delete().eq(String(uniqueKey), String(id));
        if (error) throw error;
    };

    const uploadImage = async (file: File): Promise<{ publicURL: string; path: string }> => {
        if (!bucket) throw new Error('No bucket specified');
        const path = `${Date.now()}_${file.name}`;
        const {error} = await supabase.storage.from(bucket).upload(path, file);
        if (error) throw error;
        const {data} = supabase.storage.from(bucket).getPublicUrl(path);
        return {publicURL: data.publicUrl, path};
    };

    const handleInputChange = (key: keyof T, value: any) => {
        setFormValues(prev => ({...prev, [key]: value}));
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, rowKey: any) => {
        const file = e.target.files?.[0];
        if (!file || !imageColumns) return;
        try {
            const {publicURL, path} = await uploadImage(file);
            await updateRow(rowKey, {
                [imageColumns.urlKey]: publicURL,
                [imageColumns.pathKey]: path,
            } as Partial<T>);
            await refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startNew = () => {
        setEditingKey('new');
        setFormValues({});
    };
    const startEdit = (row: T) => {
        setEditingKey(row[uniqueKey]);
        setFormValues(row);
    };
    const cancelEdit = () => {
        setEditingKey(null);
        setFormValues({});
    };

    const save = async () => {
        try {
            if (editingKey === 'new') await insert(formValues);
            else await updateRow(editingKey, formValues);
            await refresh();
            cancelEdit();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const renderCell = (col: Column<T>, row: T, isEditing: boolean) => {
        const value = row[col.key];

        if (isEditing) {
            if (col.type === 'boolean') {
                return <input type="checkbox" checked={!!formValues[col.key]}
                              onChange={e => handleInputChange(col.key, e.target.checked)}/>;
            }
            if (imageColumns && col.key === imageColumns.urlKey) {
                return (
                    <>
                        {row[imageColumns.pathKey] && (
                            <button onClick={async () => {
                                await supabase.storage.from(bucket!).remove([row[imageColumns.pathKey]]);
                                await updateRow(row[uniqueKey], {
                                    [imageColumns.urlKey]: null,
                                    [imageColumns.pathKey]: null,
                                } as Partial<T>);
                                await refresh();
                            }}>🗑️</button>
                        )}
                        <input type="file" onChange={e => handleFileChange(e, row[uniqueKey])}/>
                    </>
                );
            }
            if (col.options) {
                const opts = Array.isArray(col.options) ? col.options : optionsMap[col.options.fromTable] || [];
                return (
                    <select value={formValues[col.key] ?? ''}
                            onChange={e => handleInputChange(col.key, e.target.value)}>
                        <option value="">Select...</option>
                        {opts.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                );
            }
            if (col.editable) {
                return <input value={formValues[col.key] ?? ''}
                              onChange={e => handleInputChange(col.key, e.target.value)}/>;
            }
        }

        // Display mode
        if (col.type === 'boolean' || typeof value === 'boolean') {
            return <input type="checkbox" checked={!!value} readOnly disabled/>;
        }
        if (imageColumns && col.key === imageColumns.urlKey) {
            return value ? <img src={String(value)} width={50} alt="img"/> : '-';
        }
        if (col.render) return col.render(value, row, refresh);
        if (col.options) {
            const opts = Array.isArray(col.options)
                ? col.options
                : optionsMap[col.options.fromTable] || [];
            const found = opts.find(o => o.value === value);
            return found?.label ?? String(value);
        }
        return String(value ?? '-');
    };

    return (
        <div className={styles.tableWrapper}>
            <button onClick={startNew} className={styles.newButton}>+ New</button>
            {loading && <p>Loading…</p>}
            {error && <p className={styles.error}>{error}</p>}
            <table className={styles.table}>
                <thead>
                <tr>
                    {definitions.columns.map(col => <th key={String(col.key)}>{col.label}</th>)}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* New row at the top */}
                {editingKey === 'new' && (
                    <tr key="new">
                        {definitions.columns.map(col => (
                            <td key={String(col.key)}>
                                {col.type === 'boolean' ? (
                                    <input
                                        type="checkbox"
                                        checked={!!formValues[col.key]}
                                        onChange={(e) => handleInputChange(col.key, e.target.checked)}
                                    />
                                ) : col.options ? (
                                    Array.isArray(col.options) ? (
                                        <select
                                            value={formValues[col.key] ?? ''}
                                            onChange={e => handleInputChange(col.key, e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            {col.options.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : optionsMap[col.options.fromTable] ? (
                                        <select
                                            value={formValues[col.key] ?? ''}
                                            onChange={e => handleInputChange(col.key, e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            {optionsMap[col.options.fromTable].map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>Loading options…</span>
                                    )
                                ) : col.editable ? (
                                    <input
                                        value={formValues[col.key] ?? ''}
                                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>
                        ))}
                        <td>
                            <button onClick={save}>Create</button>
                            <button onClick={cancelEdit}>Cancel</button>
                        </td>
                    </tr>
                )}

                {/* Existing rows */}
                {rows.map(row => {
                    const isEditing = editingKey === row[uniqueKey];
                    return (
                        <tr key={String(row[uniqueKey])}>
                            {definitions.columns.map(col => (
                                <td key={String(col.key)}>
                                    {renderCell(col, row, isEditing)}
                                </td>
                            ))}
                            <td>
                                {isEditing ? (
                                    <>
                                        <button onClick={save}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(row)}>Edit</button>
                                        <button onClick={() => confirmAndDelete(row[uniqueKey])}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>

            </table>
        </div>
    );
}
