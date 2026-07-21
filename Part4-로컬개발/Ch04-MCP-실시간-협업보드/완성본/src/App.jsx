import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [praises, setPraises] = useState([])
  const [studentName, setStudentName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // 1) 처음 접속했을 때 기존 칭찬 목록 불러오기 (최신순)
  useEffect(() => {
    const fetchPraises = async () => {
      const { data, error } = await supabase
        .from('praises')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('칭찬 목록을 불러오지 못했어요:', error.message)
      } else {
        setPraises(data)
      }
    }

    fetchPraises()
  }, [])

  // 2) Supabase Realtime 구독 — 새 칭찬이 INSERT되면 즉시 화면에 반영
  useEffect(() => {
    const channel = supabase
      .channel('praises-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'praises' },
        (payload) => {
          setPraises((current) => {
            // 이미 목록에 있으면 중복 추가하지 않기
            if (current.some((p) => p.id === payload.new.id)) return current
            return [payload.new, ...current]
          })
        }
      )
      .subscribe()

    // 화면을 떠날 때 구독 해제
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 3) 칭찬 추가하기
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentName.trim() || !message.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('praises')
      .insert([{ student_name: studentName.trim(), message: message.trim() }])

    if (error) {
      alert('칭찬을 저장하지 못했어요: ' + error.message)
    } else {
      setStudentName('')
      setMessage('')
    }
    setLoading(false)
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(
      d.getHours()
    ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🌟 우리 반 실시간 칭찬 보드</h1>
        <p>친구의 좋은 점을 발견하면 바로 칭찬해 주세요!</p>
      </header>

      <form className="praise-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="학생 이름"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          maxLength={20}
        />
        <textarea
          placeholder="칭찬 메시지를 적어주세요 (예: 수학 문제를 끝까지 포기하지 않았어요!)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          maxLength={200}
        />
        <button type="submit" disabled={loading || !studentName.trim() || !message.trim()}>
          {loading ? '저장 중...' : '💌 칭찬 남기기'}
        </button>
      </form>

      <main className="board">
        {praises.length === 0 ? (
          <p className="empty">아직 칭찬이 없어요. 첫 번째 칭찬을 남겨보세요! ✨</p>
        ) : (
          praises.map((praise, index) => (
            <article key={praise.id} className={`card color-${index % 4}`}>
              <div className="card-name">🏅 {praise.student_name}</div>
              <p className="card-message">{praise.message}</p>
              <time className="card-time">{formatTime(praise.created_at)}</time>
            </article>
          ))
        )}
      </main>
    </div>
  )
}

export default App
