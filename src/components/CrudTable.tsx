import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';

export type Column<T> = {
    key: keyof T;
    label: string;
    editable?: boolean;
    /**
     * For dropdowns: either a static array of options,
     * or a spec to fetch from another table.
     */
    options?:
        | { value: any; label: string }[]
        | { fromTable: string; valueKey: string; labelKey: string };
    render?: (value: any, row: T, refresh: () => void) => React.ReactNode;
};

type CrudTableProps<T> = {
    table: string;
    columns: Column<T>[];
    uniqueKey: keyof T;
    bucket?: string;
    imageColumns?: { pathKey: keyof T; urlKey: keyof T };
};

export function CrudTable<T extends Record<string, any>>({
                                                             table,
                                                             columns,
                                                             uniqueKey,
                                                             bucket,
                                                             imageColumns,
                                                         }: CrudTableProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<any | 'new' | null>(null);
    const [formValues, setFormValues] = useState<Partial<T>>({});
    const [optionsMap, setOptionsMap] = useState<
        Record<string, { value: any; label: string }[]>
    >({});

    // load table rows
    const refresh = async () => {
        setLoading(true);
        const { data, error } = await supabase.from(table).select('*');
        if (error) setError(error.message);
        else setRows(data || []);
        setLoading(false);
    };

    // fetch dropdown options where defined
    useEffect(() => {
        columns.forEach(col => {
            if (col.options && !Array.isArray(col.options)) {
                const { fromTable, valueKey, labelKey } = col.options;
                if (!optionsMap[fromTable]) {
                    supabase
                        .from(fromTable)
                        .select(`${valueKey},${labelKey}`)
                        .then(({ data, error }) => {
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
                }
            }
        });
    }, [columns]);

    useEffect(() => {
        refresh();
    }, [table]);

    // CRUD helpers
    const insert = async (newRow: Partial<T>) => {
        const { data, error } = await supabase.from(table).insert(newRow).select();
        if (error) throw error;
        return data![0];
    };

    const updateRow = async (id: any, updates: Partial<T>) => {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq(String(uniqueKey), String(id))
            .select();
        if (error) throw error;
        return data![0];
    };

    const deleteRow = async (id: any) => {
        const { error } = await supabase.from(table).delete().eq(String(uniqueKey), String(id));
        if (error) throw error;
    };

    // image upload/delete logic
    const uploadImage = async (file: File): Promise<{ publicURL: string; path: string }> => {
        if (!bucket) throw new Error('No bucket specified');
        const path = `${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
        if (!publicUrl) throw new Error('Failed to retrieve public URL');
        return { publicURL: publicUrl, path };
    };

    const deleteImage = async (path: string) => {
        if (!bucket) throw new Error('No bucket specified');
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw error;
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, rowKey: any) => {
        const file = e.target.files?.[0];
        if (!file || !imageColumns) return;
        try {
            const { publicURL, path } = await uploadImage(file);
            await updateRow(rowKey, {
                [imageColumns.urlKey]: publicURL,
                [imageColumns.pathKey]: path,
            } as Partial<T>);
            await refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startNew = () => { setEditingKey('new'); setFormValues({}); };
    const startEdit = (row: T) => { setEditingKey(row[uniqueKey]); setFormValues(row); };
    const cancelEdit = () => { setEditingKey(null); setFormValues({}); };

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

    const handleInputChange = (key: keyof T, value: any) => {
        setFormValues(vals => ({ ...vals, [key]: value }));
    };

    // render table
    return (
        <div>
            <button onClick={startNew}>+ New</button>
            {loading && <p>Loading…</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                <tr>
                    {columns.map(col => <th key={String(col.key)}>{col.label}</th>)}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* New row */}
                {editingKey === 'new' && (
                    <tr>
                        {columns.map(col => (
                            <td key={String(col.key)}>
                                {/* Image upload for new */}
                                {imageColumns && col.key === imageColumns.urlKey ? (
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, null)} />
                                ) : col.options ? (
                                    /* dropdown logic */
                                    Array.isArray(col.options)
                                        ? (
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
                                        ) : <span>Loading options...</span>
                                ) : col.editable ? (
                                    <input
                                        value={formValues[col.key] ?? ''}
                                        onChange={e => handleInputChange(col.key, e.target.value)}
                                    />
                                ) : '-'}
                            </td>
                        ))}
                        <td>
                            <button onClick={save}>Create</button>
                            <button onClick={cancelEdit}>Cancel</button>
                        </td>
                    </tr>
                )}

                {/* Existing rows */}
                {rows.map(row => (
                    <tr key={String(row[uniqueKey])}>
                        {columns.map(col => {
                            const value = row[col.key];
                            // editing row
                            if (editingKey === row[uniqueKey]) {
                                // image edit
                                if (imageColumns && col.key === imageColumns.urlKey) {
                                    return (
                                        <td key={String(col.key)}>
                                            {row[imageColumns.pathKey] ? (
                                                <>
                                                    <button onClick={async () => {
                                                        await deleteImage(row[imageColumns.pathKey] as string);
                                                        await updateRow(row[uniqueKey], { [imageColumns.urlKey]: null, [imageColumns.pathKey]: null } as Partial<T>);
                                                        await refresh();
                                                    }}>🗑️</button>
                                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, row[uniqueKey])} />
                                                </>
                                            ) : (
                                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, row[uniqueKey])} />
                                            )}
                                        </td>
                                    );
                                }
                                // dropdown
                                if (col.options) {
                                    const opts = Array.isArray(col.options)
                                        ? col.options
                                        : optionsMap[col.options.fromTable] || [];
                                    return (
                                        <td key={String(col.key)}>
                                            <select
                                                value={formValues[col.key] ?? ''}
                                                onChange={e => handleInputChange(col.key, e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                {opts.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                }
                                // text input
                                if (col.editable) {
                                    return (
                                        <td key={String(col.key)}>
                                            <input
                                                value={formValues[col.key] ?? ''}
                                                onChange={e => handleInputChange(col.key, e.target.value)}
                                            />
                                        </td>
                                    );
                                }
                            }
                            // display mode
                            if (imageColumns && col.key === imageColumns.urlKey) {
                                return (
                                    <td key={String(col.key)}>
                                        {value ? <img src={String(value)} width={50} alt="img" /> : '-'}
                                    </td>
                                );
                            }
                            if (col.render) return <td key={String(col.key)}>{col.render(value, row, refresh)}</td>;
                            if (col.options) {
                                const opts = Array.isArray(col.options)
                                    ? col.options
                                    : optionsMap[col.options.fromTable] || [];
                                const found = opts.find(o => o.value === value);
                                return <td key={String(col.key)}>{found ? found.label : String(value)}</td>;
                            }
                            return <td key={String(col.key)}>{String(value ?? '-')}</td>;
                        })}
                        <td>
                            {editingKey === row[uniqueKey] ? (
                                <>
                                    <button onClick={save}>Save</button>
                                    <button onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => startEdit(row)}>Edit</button>
                                    <button onClick={() => deleteRow(row[uniqueKey]).then(refresh)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}