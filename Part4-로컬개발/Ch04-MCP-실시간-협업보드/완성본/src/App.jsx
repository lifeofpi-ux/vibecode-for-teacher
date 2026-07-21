import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [praises, setPraises] = useState([])
  const [to, setTo] = useState('')
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
    if (!to.trim() || !message.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('praises')
      .insert([{ student_name: to.trim(), message: message.trim() }])

    if (error) {
      alert('칭찬을 저장하지 못했어요: ' + error.message)
    } else {
      setTo('')
      setMessage('')
    }
    setLoading(false)
  }

  // "3월 11일 오후 11:10" 형태로 표시
  const formatTime = (iso) => {
    const d = new Date(iso)
    let h = d.getHours()
    const ampm = h < 12 ? '오전' : '오후'
    h = h % 12 || 12
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${h}:${String(
      d.getMinutes()
    ).padStart(2, '0')}`
  }

  return (
    <div className="page">
      <header className="hero">
        <h1 className="title">🌟 우리 반 칭찬 보드 🌟</h1>
        <p className="subtitle">친구에게 따뜻한 마음을 전해보세요!</p>
      </header>

      <form className="card form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="to">받는 사람</label>
        <input
          id="to"
          className="input"
          type="text"
          placeholder="친구 이름"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          maxLength={20}
        />

        <label className="label" htmlFor="message">칭찬 내용</label>
        <textarea
          id="message"
          className="textarea"
          placeholder="칭찬 메시지를 적어주세요!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
        />

        <button
          className="submit"
          type="submit"
          disabled={loading || !to.trim() || !message.trim()}
        >
          {loading ? '저장 중...' : '칭찬 남기기 ✨'}
        </button>
      </form>

      <h2 className="list-title">따뜻한 마음들 💌 ({praises.length})</h2>

      <main className="board">
        {praises.length === 0 ? (
          <p className="empty">아직 칭찬이 없어요. 첫 번째 칭찬을 남겨보세요! ✨</p>
        ) : (
          praises.map((praise) => (
            <article key={praise.id} className="praise-card">
              <div className="praise-to">To. {praise.student_name}</div>
              <p className="praise-message">{praise.message}</p>
              <hr />
              <time className="praise-time">{formatTime(praise.created_at)}</time>
            </article>
          ))
        )}
      </main>
    </div>
  )
}

export default App
