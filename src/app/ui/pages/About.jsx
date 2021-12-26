import { Link } from 'solid-app-router'

export default () => {
  return (
    <div class="page">
      <div class="content">
        <img class="logo" src="/images/logo.svg" />
        <h1>About Us</h1>
        <h2>The Litter Map Project</h2>
        <p>
          From Chapel Hill to Hanoi, we all face the same realization. Litter is everywhere. Let's get together and clean up our home.
        </p>
        <h2>The Earth Stewards</h2>
        <p>
          The Earth Stewards is an initiative to bring people together over taking stewardship of the planet we're living on. You can support us by joining an initiative or purchasing our merchandise.
        </p>
        <p>
          🌍 <a href="https://www.theearthstewards.com/">The Earth Stewards</a>
        </p>
        <h2>Terms of Service</h2>
        <p>
          Our <Link href="/terms">terms</Link> are designed to recognize that you own the content that you contribute.
        </p>
      </div>
    </div>
  )
}
