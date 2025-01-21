"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "@/components/ui/card";
import { CardHeaderComponent } from "./header";
import { FileUpload } from "./file-upload";
import { HorasTable } from "./horas-table";

interface DadosHoras {
    profissional: string;
    data: string;
    horas: number;
}

interface PivotedData {
    profissional: string;
    [key: string]: number | string; 
}

export default function HorasTrabalhadasApp() {
    const [fileName, setFileName] = useState<string | null>(null);
    const [dadosPivotados, setDadosPivotados] = useState<PivotedData[]>([]);
    const [dias, setDias] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const structuredData: DadosHoras[] = jsonData
                .slice(3)
                .filter(row => row[0] && row[1] && row[5] && !isNaN(row[5]) && row[5] > 0)
                .map(row => ({
                    profissional: row[0],
                    data: XLSX.SSF.format("dd/mm/yyyy", row[1]),
                    horas: parseFloat(row[5]),
                }));

            const { pivot, allDays } = structuredData.reduce((acc, { profissional, data, horas }) => {
                if (!acc.pivot[profissional]) acc.pivot[profissional] = {};
                acc.pivot[profissional][data] = (acc.pivot[profissional][data] || 0) + horas;
                acc.allDays.add(data);
                return acc;
            }, { pivot: {} as Record<string, Record<string, number>>, allDays: new Set<string>() });

            setDias(Array.from(allDays).sort());
            setDadosPivotados(Object.entries(pivot).map(([profissional, horasPorDia]) => ({
                profissional,
                ...horasPorDia,
            })));
        };

        reader.readAsArrayBuffer(file);
    };

    const handleClear = () => {
        setFileName(null);
        setDadosPivotados([]);
        setDias([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Card className="w-full">
            <CardHeaderComponent />
            <CardContent>
                <FileUpload
                    fileName={fileName}
                    onFileUpload={handleFileUpload}
                    onClear={handleClear}
                    fileInputRef={fileInputRef} />
                <HorasTable dias={dias} dadosPivotados={dadosPivotados} />
            </CardContent>
        </Card>
    );
}
