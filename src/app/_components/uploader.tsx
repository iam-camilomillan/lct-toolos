"use client";

import Papa from "papaparse";
import { useState } from "react";

export default function CsvUploader() {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (!file) return;

        Papa.parse<string[]>(file, {
            skipEmptyLines: false,

            complete: (results) => {
                const rows = results.data;

                if (rows.length === 0) {
                    return;
                }

                // Determine number of columns from the largest row
                const columnCount = Math.max(
                    ...rows.map((row) => row.length)
                );

                // Header:
                // First column = payorId
                // All remaining headers = empty
                const header = [
                    "payorId",
                    ...Array(columnCount).fill(""),
                ];

                const dataRows = rows.map((row) => {


                    // Empty the 13th column of the FINAL CSV
                    // Array index 12 = column 13
                    row[12] = "";

                    return row;
                });

                const output = Papa.unparse([
                    header,
                    ...dataRows,
                ]);

                const blob = new Blob([output], {
                    type: "text/csv;charset=utf-8;",
                });

                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = "modified-trips.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);
            },
        });
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                }}
            />

            <button
                type="button"
                onClick={handleUpload}
                disabled={!file}
            >
                Process CSV
            </button>
        </div>
    );
}