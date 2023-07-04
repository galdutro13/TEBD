import React, { useState } from "react";
import "./index.scss";
import { Button, TextField } from "@mui/material";
import axios from 'axios';

function Home() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);

    const search = async () => {
        try {
            const res = await axios.get('http://localhost:4000/search', { params: { query: query } });
            setResult(res.data.releases);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="welcome-div">
            <div className="content">
                <h1>Bem vindo</h1>
                <p>
                    Este é um sistema criado pelos alunos <strong>Arthur Alves de Moraes - 11915407, Gabriel Assenço  - 11295887, Gregório Assagra - 10856824, Gabriel Urdiale - 10414612, Louis Siu Lung Lau - 10816822, Vinícius M O de Moraes - 11207748</strong>, com a orientação do professor <strong>Luciano Araújo</strong>. Este tem o objetivo de entender e explorar os limites de um banco de dados baseado em grafos, em um cenário de um app para recomendação de músicas
                </p>
                <div className="start">
                    <h2>
                        Vamos começar?
                    </h2>
                    <div className="start-form">
                        <TextField 
                            className="standard-basic" 
                            label="Busque por um lançamento..." 
                            variant="standard" 
                            value={query} 
                            onChange={e => setQuery(e.target.value)} 
                        />
                        <Button onClick={search} variant="contained">Criar Recomendação</Button>
                    </div>
                </div>
                {/* Render the results */}
                {result.map((release, index) => (
                    <div key={index}>
                        <h3>{release.title}</h3>
                        <p>{release.artists}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
