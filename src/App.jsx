import { useState } from 'react';
import { getGPTResponse } from './api';

function App() {
  const [time, setTime] = useState(3);
  const [tasks, setTasks] = useState('');
  const [focusTime, setFocusTime] = useState(25);
  const [result, setResult] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSchedule = () => {
    if (focusTime <= 0) {
      alert("집중 시간 단위는 1분 이상이어야 합니다.");
      return;
    }

    const taskList = tasks.split('\n').filter(t => t.trim() !== '');
    const blocks = Math.floor((time * 60) / focusTime);
    let schedule = '';
    let hour = 9;
    let minute = 0;
    let taskIndex = 0;

    for (let i = 0; i < blocks; i++) {
      const task = taskList[taskIndex % taskList.length];
      const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      minute += focusTime;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute %= 60;
      }

      const end = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      schedule += `${start} ~ ${end} : ${task}\n`;
      taskIndex++;
    }

    setResult(schedule);
  };

  const generateGPTResponse = async () => {
    if (!chatInput.trim()) return;

    setLoading(true);
    try {
      const fullPrompt = `다음 할 일 목록을 기반으로 오늘의 AI 스케줄을 작성해줘:\n${chatInput}`;
      const response = await getGPTResponse(fullPrompt, import.meta.env.VITE_OPENAI_API_KEY);
      setChatResponse(response);
    } catch (error) {
      setChatResponse("에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>AI 시간표</h1>

      <div style={{ marginBottom: 20 }}>
        <label>오늘 남은 시간 (시간 단위)</label>
        <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>할 일 목록 (한 줄에 하나씩)</label>
        <textarea rows={5} value={tasks} onChange={(e) => setTasks(e.target.value)} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>집중 시간 단위 (분 또는 120→2시간도 입력 가능)</label>
        <input type="number" value={focusTime} onChange={(e) => setFocusTime(Number(e.target.value))} />
      </div>

      <button onClick={generateSchedule}>일정 생성하기</button>

      {result && (
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
          {result}
        </pre>
      )}

      <div style={{ margin: '40px 0' }}>
        <label>AI에게 스케줄 물어보기</label>
        <textarea
          rows={4}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="오늘 해야 할 일을 입력하세요"
        />
        <button onClick={generateGPTResponse} disabled={loading}>
          {loading ? '불러오는 중...' : 'AI에게 물어보기'}
        </button>
      </div>

      {chatResponse && (
        <div style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>
          <h3>💡 AI 스케줄 제안</h3>
          <p>{chatResponse}</p>
        </div>
      )}

      <div style={{ textAlign: 'center', color: '#aaa', marginTop: 40 }}>
        [ 광고 자리 ]
      </div>
    </main>
  );
}

export default App;


