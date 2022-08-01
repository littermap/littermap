import { Link } from 'solid-app-router'

export default () => {
  return (
    <div class="page">
      <div class="content">
        <img class="logo" src="/images/logo.svg" />
        <h1>Frequently Asked Questions</h1>
        <h2>How can I contribute?</h2>
        <p>
          Use it and tell your friends. Join us on <a href="https://discord.gg/JvEQMSQaYr">discord</a>.
        </p>
        <h2>Can places be edited?</h2>
        <p>
          They can't be edited or deleted yet (see <a href="https://github.com/earthstewards/littermap-aws-backend/issues/15">issue on github</a>).
        </p>
        <p>
          Stay in <Link href="/contact">touch</Link> with the project to be in the know when new features get added.
        </p>
        <h2>Does this site use cookies?</h2>
        <p>
          This site uses cookies to keep track of whether you're logged in.
        </p>
        <h2>I'd like to donate to support this project</h2>
        <p>
          We are working on accepting donations to make this an openly funded project.
        </p>
        <h2>Who created this project?</h2>
        <p>
          This project was started by <a href="https://tiktok.com/@danieltoben">Daniel Toben</a> and <a href="https://github.com/specious">Ildar Sagdejev</a> and we are looking for contributors interested in joining the team.
        </p>
        <h2>Is the code for this app available?</h2>
        <p>
          The code for both the app and the back-end service is on <a href="https://github.com/earthstewards">github</a> and you can help make it better.
        </p>
      </div>
    </div>
  )
}
