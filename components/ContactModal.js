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
  const [experience, setExperience] = useState('Fresher')
  const [years, setYears] = useState(1)
  const [state, setState] = useState('Andhra Pradesh')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function resetForm() {
    setName('')
    setEmail('')
    setMobile('')
    setExperience('Fresher')
    setYears(1)
    setState('Andhra Pradesh')
    setError(null)
    setSuccess(null)
  }

  function validate() {
    if (!name.trim()) return 'Please enter your name.'
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email.'
    if (!mobile.trim() || !/^\+?[0-9\s-]{7,15}$/.test(mobile)) return 'Please enter a valid mobile number.'
    if (experience === 'Experienced' && (!years || years < 1)) return 'Please select years of experience.'
    if (!state.trim()) return 'Please select your state.'
    return null
  }

  function toEnum(value) {
    return value.toUpperCase().replace(/\s+/g, '_')
  }

  function yearsToEnum(y) {
    const map = {
      1: 'ONE_YEAR',
      2: 'TWO_YEARS',
      3: 'THREE_YEARS',
      4: 'FOUR_YEARS',
      5: 'FIVE_YEARS',
      6: 'SIX_YEARS',
      7: 'SEVEN_YEARS',
      8: 'EIGHT_YEARS',
      9: 'NINE_YEARS',
      10: 'TEN_PLUS_YEARS',
    }
    return map[y] || 'ONE_YEAR'
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
        experienceLevel: experience === 'Experienced' ? 'EXPERIENCED' : 'FRESHER',
        state: toEnum(state),
      }
      if (experience === 'Experienced') {
        payload.yearsOfExperience = yearsToEnum(years)
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
                  {[
                    'Andhra Pradesh',
                    'Karnataka',
                    'Maharashtra',
                    'Tamil Nadu',
                    'Telangana',
                    'Delhi',
                  ].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>Fresher</option>
                  <option>Experienced</option>
                </select>
              </div>

              {experience === 'Experienced' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <select value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full rounded-md border border-gray-300 px-3 py-2">
                    {Array.from({length:10}, (_,i)=>i+1).map(y=> (
                      <option key={y} value={y}>{y === 10 ? '10+ years' : `${y} year${y>1?'s':''}`}</option>
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
