"use client";

import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Home() {
  // Состояния для формы записи
  const [certId, setCertId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");

  // Состояние для формы чтения
  const [searchId, setSearchId] = useState("");

  // Хук Scaffold-ETH для записи (Write)
  const { writeContractAsync: issueCertificate, isPending: isWriting } = useScaffoldWriteContract("CertificateRegistry");

  // Хук Scaffold-ETH для чтения (Read)
  const { data: certData, isFetching: isReading } = useScaffoldReadContract({
    contractName: "CertificateRegistry",
    functionName: "verifyCertificate",
    args: [searchId ? BigInt(searchId) : 0n],
  });

  const handleIssue = async () => {
    try {
      await issueCertificate({
        functionName: "issueCertificate",
        args: [BigInt(certId), studentName, courseName],
      });
    } catch (e) {
      console.error("Ошибка транзакции:", e);
    }
  };

  return (
    <div className="flex items-center flex-col pt-10 p-5">
      <h1 className="text-3xl font-bold mb-8">Реестр Сертификатов</h1>

      
      <div className="card w-96 bg-base-100 shadow-xl mb-8 p-6 bg-secondary">
        <h2 className="text-xl font-bold mb-4">Выдать сертификат (Admin)</h2>
        <input type="number" placeholder="ID сертификата" className="input mb-2 w-full text-black" value={certId} onChange={e => setCertId(e.target.value)} />
        <input type="text" placeholder="Имя студента" className="input mb-2 w-full text-black" value={studentName} onChange={e => setStudentName(e.target.value)} />
        <input type="text" placeholder="Название курса" className="input mb-4 w-full text-black" value={courseName} onChange={e => setCourseName(e.target.value)} />
        
        <button className="btn btn-primary w-full" onClick={handleIssue} disabled={isWriting}>
          {isWriting ? "Загрузка транзакции..." : "Выдать"}
        </button>
      </div>

      
      <div className="card w-96 bg-base-100 shadow-xl p-6 bg-secondary">
        <h2 className="text-xl font-bold mb-4">Проверить сертификат</h2>
        <input type="number" placeholder="Введите ID сертификата" className="input mb-4 w-full text-black" value={searchId} onChange={e => setSearchId(e.target.value)} />
        
        <div className="bg-base-200 p-4 rounded-lg">
          {isReading ? (
            <p>Загрузка данных...</p>
          ) : certData && certData[3] ? (
            <div>
              <p><strong>Статус:</strong> Подлинный ✅</p>
              <p><strong>Студент:</strong> {certData[0]}</p>
              <p><strong>Курс:</strong> {certData[1]}</p>
              <p><strong>Дата выдачи:</strong> {new Date(Number(certData[2]) * 1000).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-500">Сертификат не найден или недействителен</p>
          )}
        </div>
      </div>
    </div>
  );
}