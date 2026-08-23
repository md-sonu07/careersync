const Loader = ({ size = 24 }) => (
  <div className="flex items-center justify-center p-8">
    <div
      className="animate-spin rounded-full border-2 border-zinc-200 border-t-black"
      style={{ width: size, height: size }}
    />
  </div>
)

export default Loader
