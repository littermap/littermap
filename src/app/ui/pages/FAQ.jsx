import { Link } from 'solid-app-router'

export default () => {
  return (
    <div class="page">
      <div class="content">
        <img class="logo" src="/images/logo.svg" />
        <h1>Frequently Asked Questions</h1>
        <h2>How can I contribute?</h2>
        <p>
          Use it and tell your friends. Join us on <a href="https://discord.gg/uxUPk8kb">Discord</a>.
        </p>
        <h2>Can places be edited?</h2>
        <p>
          They can't be edited or deleted yet.
        </p>
        <p>
          These features are coming soon. Stay in <Link href="/contact">touch</Link> with us to be the first to know.
        </p>
        <h2>I'd like to donate to support this project</h2>
        <p>
          We are working on accepting donations to make this an openly funded project.
        </p>
        <h2>Who created this project?</h2>
        <p>
          This project was started by <a href="https://tiktok.com/@danieltoben">Daniel Toben</a> and <a href="https://github.com/specious">Ildar Sagdejev</a>.
        </p>
        <p>
          But we are looking for contributors interested in joining the team.
        </p>
        <h2>How is this app written?</h2>
        <p>
          Nobody actually asks this question.
        </p>
      </div>
    </div>
  )
}
