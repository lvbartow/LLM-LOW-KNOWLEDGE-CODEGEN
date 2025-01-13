"use client";
import React, { useState } from "react";
import styles from "./vdpl.module.css";

export default function Page() {
    const [fileContent1, setFileContent1] = useState<string | null>(null); // First Ecore Model
    const [fileContent2, setFileContent2] = useState<string | null>(null); // Second Ecore Model
    const [userViewPath, setUserViewPath] = useState<string | null>(null); // User View Description
    const [selectedOption, setSelectedOption] = useState<string>("Gemini");
    const [result, setResult] = useState<string>("Results");

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFileContent: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
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

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            alert("Please select an option before generating results.");
            return;
        }

        // Construction de l'URL
        const endpoint =
            selectedOption === "Gemini"
                ? "http://localhost:8000/vpdl"
                : "http://localhost:8000/vpdlOpenAI";

        // Préparer les données à envoyer
        const payload = {
            userViewPath: userViewPath || "",
            ecoreFiles: [fileContent1, fileContent2].filter(Boolean) as string[], // Filtrer les valeurs non nulles
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.text();
                setResult(data);
            } else {
                setResult(`Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setResult(`Error`);
        }
    };

    return (
        <div className={styles.layoutContainer}>
            <h1>Inputs</h1>
            <div className={styles.container}>
                <div
                    className={styles.smallBox}
                    onClick={() => document.getElementById("fileInput1")?.click()}
                >
                    {fileContent1 || "PlantUML Model 1"}
                    <input
                        id="fileInput1"
                        type="file"
                        accept=".txt"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, setFileContent1)}
                    />
                </div>

                <div
                    className={styles.smallBox}
                    onClick={() => document.getElementById("fileInput2")?.click()}
                >
                    {fileContent2 || "PlantUML Model 2"}
                    <input
                        id="fileInput2"
                        type="file"
                        accept=".txt"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, setFileContent2)}
                    />
                </div>

                <div
                    className={styles.smallBox}
                    onClick={() => document.getElementById("userViewPath")?.click()}
                >
                    {userViewPath || "User View Description"}
                    <input
                        id="userViewPath"
                        type="file"
                        accept=".txt"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, setUserViewPath)}
                    />
                </div>

                <div className={styles.radioContainer}>
                    <h3>Choix du LLM</h3>
                    <label>
                        <input
                            type="radio"
                            name="model"
                            value="Gemini"
                            checked={selectedOption === "Gemini"}
                            onChange={handleRadioChange}
                        />
                        Gemini
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="model"
                            value="ChatGPT"
                            checked={selectedOption === "ChatGPT"}
                            onChange={handleRadioChange}
                        />
                        ChatGPT
                    </label>
                </div>

                <button className={styles.button} onClick={handleSubmit}>
                    Generate
                </button>
            </div>

            <h1>Results</h1>
            <pre className={styles.bigBox}>{result}</pre>
        </div>
    );
}
