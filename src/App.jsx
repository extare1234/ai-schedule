import { useState } from 'react';

function App() {
  const [time, setTime] = useState(3); // 총 시간 (시간 단위)
  const [tasks, setTasks] = useState(''); // 할 일 목록 (줄바꿈 기준)
  const [focusTime, setFocusTime] = useState(25); // 집중 시간 단위 (분)
  const [result, setResult] = useState('');

  const generateSchedule = () => {
    if (focusTime <= 0) {
      alert("집중 시간 단위는 1분 이상이어야 합니다.");
      return;
    }

    const taskList = tasks.split('\n').filter(t => t.trim() !== '');
    const blocks = Math.floor((time * 60) / focusTime); // 총 블록 수 (분 단위로 환산 후 나눔)
    let schedule = '';
    let hour = 9;
    let minute = 0;
    let taskIndex = 0;

    for (let i = 0; i < blocks; i++) {
      const task = taskList[taskIndex % taskList.length];
      const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      minute += focusTime;
      while (minute >= 60) {
        hour += 1;
        minute -= 60;
      }

      const end = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      schedule += `${start} ~ ${end} : ${task}\n`;
      taskIndex++;
    }

    setResult(schedule);
  };

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>AI 시간표</h1>

      <div style={{ marginBottom: 20 }}>
        <label>오늘 남은 시간 (시간 단위)</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          min={0.5}
          step={0.5}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>할 일 목록 (한 줄에 하나씩)</label>
        <textarea
          rows={5}
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>집중 시간 단위 (분)</label>
        <input
          type="number"
          value={focusTime}
          onChange={(e) => setFocusTime(Number(e.target.value))}
          min={1}
        />
      </div>

      <button onClick={generateSchedule}>일정 생성하기</button>

      {result && (
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
          {result}
        </pre>
      )}

      <div style={{ textAlign: 'center', color: '#aaa', marginTop: 40 }}>
        [ 광고 자리 ]
      </div>
    </main>
  );
}

export default App;

