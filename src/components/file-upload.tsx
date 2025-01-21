import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, RefreshCw } from 'lucide-react';

interface FileUploadProps {
    fileName: string | null;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function FileUpload({ fileName, onFileUpload, onClear, fileInputRef }: FileUploadProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    onChange={onFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                    accept=".xlsx,.xls"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                    <Upload size={16} />
                    Anexar Arquivo
                </Button>
                {fileName && <span className="text-sm text-gray-500">{fileName}</span>}
                {fileName && (
                    <Button variant="ghost" size="icon" onClick={onClear}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
