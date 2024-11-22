# Agent-Assisted Accessibility Code Review

This simple site is intended to test whether a sufficiently opinionated prompt can adequately catch accessibility violations.


Here's a video without audio demonstrating mostly the interface behavior, in which a user can paste any git diff (or multiple in the same text box), submit, and receive after about 30 seconds a naive git diff interface where general comments are provided, as well as line-specific comments and suggestions. The suggestions include click-only functionality, un-labelled inputs, and errors that are not programmatically linked to their form field.

https://github.com/user-attachments/assets/e5d3ffbe-1359-4770-a68e-3ea630a74cde



## Environment

```env
ANTHROPIC_API_KEY=your-key
```

## Helpful testing

A diff that I used during testing:

```diff
diff --git a/src/DisabledButton.jsx b/src/DisabledButton.jsx
--- a/src/DisabledButton.jsx
+++ b/src/DisabledButton.jsx
@@ -1,5 +1,7 @@
 function SubmitButton({ isLoading }) {
-  return <button type="submit">Submit</button>;
+  return (
+    <button type="submit" style={{ opacity: 0.5, pointerEvents: 'none' }} onClick={() => console.log('clicked')}>
+      {isLoading ? 'Loading...' : 'Submit'}
+    </button>
+  );
 }
-
-export default SubmitButton;
\ No newline at end of file
+export default SubmitButton;

diff --git a/src/Modal.jsx b/src/Modal.jsx
--- a/src/Modal.jsx
+++ b/src/Modal.jsx
@@ -1,6 +1,19 @@
 function Modal({ isOpen, children }) {
   if (!isOpen) return null;
   
-  return <div className="modal">{children}</div>;
+  return (
+    <div 
+      style={{
+        position: 'fixed',
+        top: '50%',
+        left: '50%',
+        transform: 'translate(-50%, -50%)',
+        background: 'white',
+        padding: '20px',
+        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
+      }}>
+      {children}
+      <span onClick={() => isOpen(false)} style={{cursor: 'pointer', position: 'absolute', top: '10px', right: '10px'}}>×</span>
+    </div>
+  );
 }
 
diff --git a/src/Form.jsx b/src/Form.jsx
--- a/src/Form.jsx
+++ b/src/Form.jsx
@@ -1,9 +1,16 @@
 function ContactForm() {
   return (
     <div className="form">
-      <label>Name: <input type="text" /></label>
-      <label>Email: <input type="email" /></label>
-      <button type="submit">Send</button>
+      <div>
+        <input type="text" placeholder="Enter your name" />
+      </div>
+      <div style={{ color: 'red', display: 'none' }} id="nameError">
+        Name is required
+      </div>
+      <div>
+        <input type="email" placeholder="Enter your email" />
+      </div>
+      <button onClick={handleSubmit}>Send</button>
     </div>
   );
 }
 ```
