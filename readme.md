# Agent-Assisted Accessibility Code Review

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