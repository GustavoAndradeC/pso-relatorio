import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface HorasTableProps {
    dias: string[];
    dadosPivotados: any[];
}

export function HorasTable({ dias, dadosPivotados }: HorasTableProps) {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredData = dadosPivotados.filter(item =>
        item.profissional.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isWeekend = (dia: string) => {
        const [day, month, year] = dia.split("/").map(Number);
        const formattedDate = new Date(year, month - 1, day);
        const dayOfWeek = formattedDate.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const isLessThanEight = (value: number) => value < 8;

    return (
        <div>
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Filtrar por nome"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-60 text-sm py-1 px-3"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        {dias.map((dia, index) => (
                            <TableHead
                                key={index}
                                className={isWeekend(dia) ? "bg-yellow-100" : ""}
                            >
                                {dia}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="whitespace-nowrap">{item.profissional}</TableCell>
                            {dias.map(dia => {
                                const value = item[dia] as number;
                                return (
                                    <TableCell
                                        key={dia}
                                        className={`${isLessThanEight(value) ? "bg-red-100" : ""} text-center`}
                                    >
                                        {(value)?.toFixed(2) || "0.00"}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
