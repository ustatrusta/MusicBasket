export default function LoginPage(): React.JSX.Element {
  return (
    <main style={{ maxWidth: 420, margin: '5rem auto', display: 'grid', gap: 12 }}>
      <h1>Giriş</h1>
      <input placeholder="E-posta" />
      <input placeholder="Şifre" type="password" />
      <button type="button">Giriş Yap</button>
      <p>Not: Kimlik doğrulama Faz 2'de genişletilecektir.</p>
    </main>
  );
}
