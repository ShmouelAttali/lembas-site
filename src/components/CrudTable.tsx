import React, {useState, useEffect, ChangeEvent} from 'react';
import {supabase} from '@/lib/supabase';

export type Column<T> = {
    key: keyof T;
    label: string;
    editable?: boolean;
    render?: (value: any, row: T, refresh: () => void) => React.ReactNode;
};

type CrudTableProps<T> = {
    table: string;
    columns: Column<T>[];
    uniqueKey: keyof T;
    bucket?: string; // Supabase Storage bucket for images
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

    const refresh = async () => {
        setLoading(true);
        const {data, error} = await supabase.from<T>(table).select('*');
        console.log('data', data);
        if (error) setError(error.message);
        else setRows(data || []);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
    }, []);

    const insert = async (newRow: Partial<T>) => {
        const {data, error} = await supabase.from<T>(table).insert(newRow).select();
        if (error) throw error;
        return data![0];
    };

    const updateRow = async (id: any, updates: Partial<T>) => {
        const {data, error} = await supabase
            .from<T>(table)
            .update(updates)
            .eq(uniqueKey as string, String(id)).select();
        if (error) throw error;
        return data![0];
    };

    const deleteRow = async (id: any) => {
        const {error} = await supabase.from<T>(table).delete().eq(uniqueKey as string, String(id));
        if (error) throw error;
    };

    // Image helpers
    const uploadImage = async (file: File): Promise<{ publicURL: string; path: string }> => {
        if (!bucket) throw new Error('No bucket specified');
        const path = `${Date.now()}_${file.name}`;
        const {error: upErr} = await supabase.storage.from(bucket).upload(path, file);
        if (upErr) throw upErr;
        const {publicURL, error: urlErr} = supabase.storage.from(bucket).getPublicUrl(path);
        if (urlErr) throw urlErr;
        return {publicURL, path};
    };

    const deleteImage = async (path: string) => {
        if (!bucket) throw new Error('No bucket specified');
        const {error} = await supabase.storage.from(bucket).remove([path]);
        if (error) throw error;
    };

    const startNew = () => {
        setEditingKey('new');
        setFormValues({});
    };

    const startEdit = (row: T) => {
        console.log(row[uniqueKey], row, uniqueKey);
        setEditingKey(row[uniqueKey]);
        setFormValues(row);
    };

    const cancelEdit = () => {
        setEditingKey(null);
        setFormValues({});
    };

    const save = async () => {
        try {
            console.log('Saving', formValues, editingKey);
            if (editingKey === 'new') {
                await insert(formValues);
            } else {
                await updateRow(editingKey, formValues);
            }
            await refresh();
            cancelEdit();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleInputChange = (key: keyof T, value: any) => {
        setFormValues(vals => ({...vals, [key]: value}));
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, row: T) => {
        const file = e.target.files?.[0];
        if (!file || !imageColumns) return;
        try {
            const {publicURL, path} = await uploadImage(file);
            await updateRow(row[uniqueKey], {
                [imageColumns.urlKey]: publicURL,
                [imageColumns.pathKey]: path
            } as Partial<T>);
            refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <button onClick={startNew}>+ New</button>
            {loading && <p>Loading…</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <table>
                <thead>
                <tr>
                    {columns.map(col => <th key={String(col.key)}>{col.label}</th>)}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {editingKey === 'new' && (
                    <tr>
                        {columns.map(col => (
                            <td key={String(col.key)}>
                                {col.key === imageColumns?.urlKey ? (
                                    <input type="file" accept="image/*"
                                           onChange={e => handleFileChange(e, formValues as T)}/>
                                ) : col.editable ? (
                                    <input
                                        value={formValues[col.key] ?? ''}
                                        onChange={e => handleInputChange(col.key, e.target.value)}
                                        placeholder={String(col.label)}
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
                {rows.map(row => (
                    <tr key={String(row[uniqueKey])}>
                        {columns.map(col => (
                            <td key={String(col.key)}>
                                {editingKey === row[uniqueKey] ? (
                                    col.key === imageColumns?.urlKey ? (
                                        row[imageColumns.pathKey] ? (
                                            <>
                                                <button onClick={async () => {
                                                    await deleteImage(row[imageColumns.pathKey] as string);
                                                    await updateRow(row[uniqueKey], {
                                                        [imageColumns.urlKey]: null,
                                                        [imageColumns.pathKey]: null
                                                    } as Partial<T>);
                                                    refresh();
                                                }}>🗑️
                                                </button>
                                                <input type="file" accept="image/*"
                                                       onChange={e => handleFileChange(e, row)}/>
                                            </>
                                        ) : (
                                            <input type="file" accept="image/*"
                                                   onChange={e => handleFileChange(e, row)}/>
                                        )
                                    ) : col.editable ? (
                                        <input
                                            value={formValues[col.key] ?? ''}
                                            onChange={e => handleInputChange(col.key, e.target.value)}
                                        />
                                    ) : col.render ? (
                                        col.render(row[col.key], row, refresh)
                                    ) : (
                                        String(row[col.key] ?? '-')
                                    )
                                ) : col.render ? (
                                    col.render(row[col.key], row, refresh)
                                ) : (
                                    String(row[col.key] ?? '-')
                                )}
                            </td>
                        ))}
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
