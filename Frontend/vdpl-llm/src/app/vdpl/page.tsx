"use client"
import React, {useState} from "react";
import styles from "./vdpl.module.css";

export default function Page() {
    const [fileContent1, setFileContent1] = useState("Ecore Models");
    const [fileContent2, setFileContent2] = useState("User View Description");

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFileContent: React.Dispatch<React.SetStateAction<string>>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                    setFileContent(e.target.result);
                }
            };
            reader.readAsText(file);
        }
    };

    return <div className={styles.layoutContainer}>
        <h1>Inputs</h1>
        <div className={styles.container}>
            <div
                className={styles.smallBox}
                onClick={() => document.getElementById("fileInput1")?.click()}
            >
                {fileContent1}
                <input
                    id="fileInput1"
                    type="file"
                    accept=".txt"
                    style={{display: "none"}}
                    onChange={(e) => handleFileUpload(e, setFileContent1)}
                />
            </div>

            <div
                className={styles.smallBox}
                onClick={() => document.getElementById("fileInput2")?.click()}
            >
                {fileContent2}
                <input
                    id="fileInput2"
                    type="file"
                    accept=".txt"
                    style={{display: "none"}}
                    onChange={(e) => handleFileUpload(e, setFileContent2)}
                />
            </div>

            <button className={styles.button}>Generate</button>
        </div>
        <h1>Results</h1>
        <div className={styles.bigBox}>Results</div>
    </div>
}