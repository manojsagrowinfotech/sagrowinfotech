"use client"

import { useState, useEffect } from 'react'
import { studentApi } from '@/lib/api'

export default function ContactModal({ isOpen: controlledOpen, onClose, showButton = true }) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  
  // Sync internal state with controlled prop
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen)
    }
  }, [controlledOpen])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [experience, setExperience] = useState('FRESHER')
  const [years, setYears] = useState('')
  const [state, setState] = useState('')
  const [states, setStates] = useState([])
  const [levels, setLevels] = useState([])
  const [yearsOptions, setYearsOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    async function loadOptions() {
      try {
        const [s, l, y] = await Promise.all([
          studentApi.getStates(),
          studentApi.getExperienceLevels(),
          studentApi.getYearsOfExperience(),
        ])
        const statesData = s?.data?.states || []
        const levelsData = l?.data?.experienceLevels || []
        const yearsData = y?.data?.yearsOfExperience || []
        setStates(statesData)
        setLevels(levelsData)
        setYearsOptions(yearsData)
        if (!state && statesData.length) setState(statesData[0].key)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load options', e)
      }
    }
    loadOptions()
  }, [])

  function resetForm() {
    setName('')
    setEmail('')
    setMobile('')
    setExperience('FRESHER')
    setYears('')
    setState(states[0]?.key || '')
    setError(null)
    setSuccess(null)
  }

  function validate() {
    if (!name.trim()) return 'Please enter your name.'
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email.'
    if (!mobile.trim() || !/^\+?[0-9\s-]{7,15}$/.test(mobile)) return 'Please enter a valid mobile number.'
    if (experience === 'EXPERIENCED' && !years) return 'Please select years of experience.'
    if (!state) return 'Please select your state.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const v = validate()
    if (v) { setError(v); return }
    setLoading(true)
    try {
      const payload = {
        name,
        mobileNo: mobile,
        emailId: email,
        experienceLevel: experience,
        state,
      }
      if (experience === 'EXPERIENCED') {
        payload.yearsOfExperience = years
      }
      const res = await studentApi.createStudent(payload)
      const msg = res?.data?.message || 'Student created successfully'
      setSuccess(msg)
      resetForm()
      setTimeout(() => handleClose(), 1200)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Submission failed')
    } finally { setLoading(false) }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setInternalOpen(false)
    }
  }

  const handleOpen = () => {
    if (onClose) {
      // If controlled, we can't directly open it - this shouldn't be called when controlled
      // But for backward compatibility with showButton=true, we use internal state
      setInternalOpen(true)
    } else {
      setInternalOpen(true)
    }
  }

  return (
    <>
      {showButton && (
        <button onClick={handleOpen} className="btn-primary inline-block">
          Get Started
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={handleClose} />
          <div className="relative w-full max-w-xl mx-4 bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                  {states.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                  {levels.length ? levels.map((l)=>(
                    <option key={l.key} value={l.key}>{l.label}</option>
                  )) : (
                    <>
                      <option key="FRESHER" value="FRESHER">Fresher</option>
                      <option key="EXPERIENCED" value="EXPERIENCED">Experienced</option>
                    </>
                  )}
                </select>
              </div>

              {experience === 'EXPERIENCED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <select value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                    {yearsOptions.length ? yearsOptions.map((o)=>(
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    )) : Array.from({length:10}, (_,i)=>String(i+1)).map(y=> (
                      <option key={y} value={y}>{y === '10' ? '10+ years' : `${y} year${y>'1'?'s':''}`}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && <div className="text-sm text-red-600">{error}</div>}
              {success && <div className="text-sm text-green-600">{success}</div>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { resetForm(); handleClose() }} className="px-4 py-2 rounded-md border">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary inline-block">
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
