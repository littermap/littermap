import { Link } from 'solid-app-router'

export default () => {
  return (
    <div class="page">
      <div class="content">
        <h1>About Us</h1>
        <h2>The Litter Map Project</h2>
        <p>
          According to Greta Thunberg, there are now more plastic bottles in the ocean than there are people in India [citation needed] ...
        </p>
        <h2>The Earth Stewards</h2>
        <p>
          We started cleaning the planet after it was already too late. Learn more by picking up that plastic bottle.
        </p>
        <h2>Terms of Service</h2>
        <p>
          If you're curious how we collect your personal data, read out <Link href="/terms">terms</Link>.
        </p>
      </div>
    </div>
  )
}
