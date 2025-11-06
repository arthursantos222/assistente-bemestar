import React, { useState } from "react";
import jsPDF from "jspdf";
import "./App.css";


function App() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    rotina: "",
    sono: "",
    alimentacao: ""
  });

  const [relatorio, setRelatorio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRelatorio("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/respostas", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setRelatorio(data.relatorio);
      } else {
        alert(data.error || "Erro ao gerar relatório");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Bem-Estar", 20, 20);
    doc.setFontSize(12);
    doc.text(`Nome: ${formData.nome}`, 20, 40);
    doc.text(`Idade: ${formData.idade}`, 20, 50);
    doc.text(`Rotina: ${formData.rotina}`, 20, 60);
    doc.text(`Sono: ${formData.sono}`, 20, 70);
    doc.text(`Alimentação: ${formData.alimentacao}`, 20, 80);
    doc.text("Resumo:", 20, 100);
    doc.text(relatorio, 20, 110, { maxWidth: 170 });
    doc.save(`relatorio_${formData.nome || "usuario"}.pdf`);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Assistente de Bem-Estar</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <input
          name="idade"
          type="number"
          placeholder="Idade"
          value={formData.idade}
          onChange={handleChange}
          required
        />
        <input
          name="rotina"
          placeholder="Descreva sua rotina"
          value={formData.rotina}
          onChange={handleChange}
          required
        />
        <input
          name="sono"
          placeholder="Como é seu sono?"
          value={formData.sono}
          onChange={handleChange}
          required
        />
        <input
          name="alimentacao"
          placeholder="Como é sua alimentação?"
          value={formData.alimentacao}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Gerando..." : "Gerar Relatório"}
        </button>
      </form>

      {relatorio && (
        <div>
          <h3>✅ Relatório Gerado:</h3>
          <p>{relatorio}</p>
          <button onClick={gerarPDF}>Baixar PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
