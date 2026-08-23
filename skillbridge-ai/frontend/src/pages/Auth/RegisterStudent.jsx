import Register from "./Register";

/**
 * RegisterStudent — helper wrapper kept for backwards compatibility.
 * The main Register.jsx already handles Student | Industry | Academia tabs.
 * This file simply re-exports a pre-selected Student view for direct routing
 * if needed (e.g. /register/student).
 */
export default function RegisterStudent(props) {
  return <Register initialRole="student" {...props} />;
}
