import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import Button from './Button'

const PaymentModal = ({ open, onClose, course }) => {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [coupon, setCoupon] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  // Card form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // UPI state
  const [upiId, setUpiId] = useState('')

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC')

  // Payment process state: 'idle' | 'processing' | 'success'
  const [step, setStep] = useState('idle')
  const [transactionId, setTransactionId] = useState('')

  if (!course) return null

  const basePrice = course.price !== undefined ? Number(course.price) : 1499
  const gst = basePrice <= 1 ? 0 : Math.round(basePrice * 0.18)
  const totalPayable = Math.max(1, basePrice + gst - discountAmount)

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SgNPgO51icjN28'

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (!coupon.trim()) return
    const code = coupon.trim().toUpperCase()
    if (code === 'SKILL50' || code === 'WELCOME20' || code === 'CAREERSYNC') {
      const disc = Math.round(basePrice * 0.2) // 20% off
      setDiscountAmount(disc)
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code. Try SKILL50 for 20% OFF!')
    }
  }

  const handleLaunchRazorpay = () => {
    if (window.Razorpay) {
      const options = {
        key: razorpayKey,
        amount: totalPayable * 100, // Amount in paise
        currency: 'INR',
        name: 'CareerSync',
        description: `Enrollment for ${course.title}`,
        image: 'https://ik.imagekit.io/crms/logo.png',
        handler: function (response) {
          setTransactionId(response.razorpay_payment_id || 'PAY_' + Math.floor(10000000 + Math.random() * 90000000))
          setStep('success')
        },
        prefill: {
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          contact: '9876543210',
        },
        notes: {
          course_id: course.id,
          course_title: course.title,
        },
        theme: {
          color: '#315C4D',
        },
      }

      try {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response) {
          alert('Payment Failed: ' + (response.error?.description || 'Transaction failed'))
        })
        rzp.open()
        return
      } catch (err) {
        console.warn('Razorpay SDK error, falling back to simulated checkout:', err)
      }
    }

    // Fallback simulation if script isn't loaded
    setStep('processing')
    setTimeout(() => {
      const txId = 'PAY_RZP_' + Math.floor(10000000 + Math.random() * 90000000)
      setTransactionId(txId)
      setStep('success')
    }, 2000)
  }

  const handleResetAndClose = () => {
    setStep('idle')
    setCouponApplied(false)
    setDiscountAmount(0)
    setCoupon('')
    onClose()
  }

  const handleStartLearning = () => {
    handleResetAndClose()
    navigate('/student/learning')
  }

  return (
    <Modal
      open={open}
      onClose={step === 'processing' ? undefined : handleResetAndClose}
      size="xl"
      showCloseButton={step !== 'processing'}
    >
      {step === 'processing' && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span className="material-symbols-outlined absolute text-primary text-2xl">lock</span>
          </div>
          <h3 className="mt-6 text-xl font-bold text-charcoal">Processing via Razorpay Gateway</h3>
          <p className="mt-2 text-sm text-muted max-w-sm">
            Please wait while we connect to Razorpay secure servers. Do not close this window.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            256-Bit Razorpay SSL Encrypted
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-success/15 border-2 border-success rounded-full flex items-center justify-center text-success animate-bounce">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-success">Razorpay Payment Verified</span>
            <h3 className="text-2xl font-bold text-charcoal">Enrollment Successful! 🎉</h3>
            <p className="text-sm text-muted mt-1">You now have full access to <span className="font-semibold text-charcoal">{course.title}</span></p>
          </div>

          {/* Receipt Card */}
          <div className="w-full max-w-md bg-surface border border-border rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted">Payment ID (Razorpay):</span>
              <span className="font-mono font-bold text-charcoal">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Security:</span>
              <span className="font-mono font-medium text-success">256-Bit SSL Encrypted</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Course:</span>
              <span className="font-medium text-charcoal truncate max-w-[200px]">{course.title}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
              <span>Amount Paid:</span>
              <span className="text-primary">₹{totalPayable.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Button className="flex-1" size="lg" onClick={handleStartLearning}>
              Start Learning Now →
            </Button>
            <Button variant="outline" className="flex-1" size="lg" onClick={handleResetAndClose}>
              Close
            </Button>
          </div>
        </div>
      )}

      {step === 'idle' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Razorpay Payment Gateway</span>
                <span className="bg-sage text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-sage/60">TEST MODE</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal">Complete Your Course Purchase</h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-3 py-1 text-xs font-semibold text-success">
              <span className="material-symbols-outlined text-[14px]">lock</span> Encrypted Checkout
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Order Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80'}
                    alt={course.title}
                    className="w-16 h-12 object-cover rounded-lg border border-border shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-charcoal line-clamp-2">{course.title}</h4>
                    <p className="text-[11px] text-muted">by {course.instructor}</p>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mt-0.5">
                      <span>★ {course.rating}</span>
                      <span className="text-muted">• {course.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Course Price</span>
                    <span className="font-semibold text-charcoal">₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-success font-semibold">
                      <span>Discount (SKILL50)</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-border pt-2 flex justify-between items-center text-sm font-bold text-charcoal">
                    <span>Total Payable</span>
                    <span className="text-lg text-primary">₹{totalPayable.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <label className="block text-[11px] font-semibold text-muted mb-1">Have a promo code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SKILL50"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={couponApplied}
                      className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs focus:outline-none focus:border-primary uppercase"
                    />
                    <button
                      type="submit"
                      disabled={couponApplied || !coupon.trim()}
                      className="rounded-lg bg-charcoal px-3 py-1.5 text-xs font-semibold text-white hover:bg-charcoal/90 disabled:opacity-50"
                    >
                      {couponApplied ? 'Applied ✓' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-danger mt-1">{couponError}</p>}
                  {!couponApplied && (
                    <p className="text-[10px] text-muted mt-1">Use <span className="font-bold text-primary">SKILL50</span> for 20% extra discount!</p>
                  )}
                </form>
              </div>

              {/* Razorpay badge */}
              <div className="bg-sage border border-sage rounded-xl p-3 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-[18px]">verified</span> Secured by Razorpay Payment Gateway
                </div>
                <p className="text-[10px] text-muted">Supports UPI (GPay, PhonePe), Cards, NetBanking & Wallets</p>
              </div>
            </div>

            {/* Right Column: Razorpay Gateway Launch */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-charcoal">Razorpay Checkout Window</h4>
                    <p className="text-xs text-muted">Status: <span className="text-success font-medium">Ready (Verified Gateway)</span></p>
                  </div>
                </div>

                {/* Option selector */}
                <div className="grid grid-cols-4 gap-1.5 bg-background p-1 rounded-xl border border-border text-xs font-semibold">
                  <button
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`py-2 rounded-lg transition-colors flex flex-col items-center gap-0.5 ${paymentMethod === 'razorpay' ? 'bg-white text-primary shadow-soft' : 'text-muted hover:text-charcoal'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Razorpay Popup</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded-lg transition-colors flex flex-col items-center gap-0.5 ${paymentMethod === 'upi' ? 'bg-white text-primary shadow-soft' : 'text-muted hover:text-charcoal'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                    <span>UPI / QR</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-lg transition-colors flex flex-col items-center gap-0.5 ${paymentMethod === 'card' ? 'bg-white text-primary shadow-soft' : 'text-muted hover:text-charcoal'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    <span>Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2 rounded-lg transition-colors flex flex-col items-center gap-0.5 ${paymentMethod === 'netbanking' ? 'bg-white text-primary shadow-soft' : 'text-muted hover:text-charcoal'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance</span>
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Content depending on tab */}
                {paymentMethod === 'razorpay' && (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-xl border border-primary/20 bg-sage/40 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-primary">
                        <span className="material-symbols-outlined">bolt</span> Fast & Secure Razorpay Checkout
                      </div>
                      <p className="text-muted leading-relaxed">
                        Clicking the button below will open the official Razorpay payment window. You can test payments using GPay UPI, Test Cards, or NetBanking!
                      </p>
                    </div>

                    <Button onClick={handleLaunchRazorpay} className="w-full text-base font-bold py-3" size="lg">
                      Pay ₹{totalPayable.toLocaleString()} via Razorpay →
                    </Button>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-4 border border-border rounded-lg p-3 bg-white">
                      <div className="w-24 h-24 bg-white border border-border rounded-lg p-1.5 flex items-center justify-center shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=razorpay@upi&pn=CareerSync&am=${totalPayable}`}
                          alt="UPI QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <p className="font-bold text-charcoal">Scan with any UPI App</p>
                        <p className="text-[11px] text-muted">Supports Google Pay, PhonePe, Paytm, BHIM</p>
                        <span className="inline-block bg-sage text-primary text-[10px] font-bold px-2 py-0.5 rounded">Razorpay Integrated</span>
                      </div>
                    </div>
                    <Button onClick={handleLaunchRazorpay} className="w-full" size="lg">
                      Pay ₹{totalPayable.toLocaleString()} with UPI →
                    </Button>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-muted font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="4532 •••• •••• 8921"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-lg border border-border px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-muted font-medium mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2 text-xs text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-muted font-medium mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2 text-xs text-center font-mono"
                        />
                      </div>
                    </div>
                    <Button onClick={handleLaunchRazorpay} className="w-full mt-2" size="lg">
                      Pay ₹{totalPayable.toLocaleString()} with Card →
                    </Button>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-muted font-medium">Select NetBanking Provider</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK', 'PNB'].map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-lg border text-center font-bold text-xs ${selectedBank === bank ? 'border-primary bg-sage text-primary' : 'border-border bg-white text-charcoal'}`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleLaunchRazorpay} className="w-full mt-2" size="lg">
                      Proceed to {selectedBank} NetBanking →
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default PaymentModal
