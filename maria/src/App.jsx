import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(0); // Segundos
  const [milliseconds, setMilliseconds] = useState(0); // Milisegundos
  const [running, setRunning] = useState(false);
  const [partials, setPartials] = useState([]); // Para almacenar los parciales

  // Usamos useRef para almacenar el identificador del intervalo y evitar múltiples intervalos
  const intervalRef = useRef(null);

  // Función para formatear el tiempo en horas, minutos, segundos y milisegundos
  const formatTime = (sec, ms) => {
    const hours = Math.floor(sec / 3600); // 1 hora = 3600 segundos
    const minutes = Math.floor((sec % 3600) / 60); // 1 minuto = 60 segundos
    const seconds = sec % 60; // los segundos restantes

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  // UseEffect para manejar el intervalo de actualización
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setMilliseconds((prevMilliseconds) => {
          if (prevMilliseconds === 59) {
            setSeconds((prevSeconds) => prevSeconds + 1);
            return 0; // Si llegamos a 59 milisegundos, reiniciamos
          }
          return prevMilliseconds + 1;
        });
      }, 16); // actualizamos cada ~16ms para simular los 60fps (aproximadamente)
    } else {
      clearInterval(intervalRef.current); // Limpiamos el intervalo si no está corriendo
    }

    return () => clearInterval(intervalRef.current); // Limpiamos el intervalo cuando el componente se desmonte
  }, [running]);

  // Función para registrar un parcial
  const recordPartial = () => {
    setPartials((prevPartials) => [
      ...prevPartials,
      formatTime(seconds, milliseconds),
    ]);
  };

  // Funciones para controlar el cronómetro
  const startStopHandler = () => {
    setRunning((prevRunning) => !prevRunning);
  };

  const resetHandler = () => {
    setSeconds(0);
    setMilliseconds(0);
    setRunning(false);
    setPartials([]); // Reiniciar los parciales
  };

  return (
    <div className="App">
      <div className="timer">
        <h1>{formatTime(seconds, milliseconds)}</h1>
        <div className="controls">
          <button onClick={startStopHandler}>
            {running ? 'Pausar' : 'Iniciar'}
          </button>
          <button onClick={resetHandler}>Reiniciar</button>
          <button onClick={recordPartial} disabled={!running}>
            Parcial
          </button>
        </div>

        <div className="partials">
          <h2>Parciales</h2>
          <ul>
            {partials.map((partial, index) => (
              <li key={index}>{partial}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
