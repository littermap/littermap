import { Link } from 'solid-app-router'

export default () => {
  return (
    <div class="page">
      <div class="content">
        <img class="logo" src="/images/logo.svg" />
        <h1>About Us</h1>
        <p>
          From <a href="http://jamesandkarlamurray.blogspot.com/2013/12/a-walk-along-crack-tracks-bronx-new.html">New York</a> to <a href="http://www.china.org.cn/china/2013-02/27/content_28072058.htm">Beijing</a>, we all face the same realization. Garbage is everywhere. Let's get together and clean up our home.
        </p>
        <h2>Litter Map</h2>
        <p>
          The Litter Map project aims to be the missing piece to the long-standing puzzle of how we can all collaborate on cleaning up our home planet.
        </p>
        <p>
          Being a free and open source collaboration platform, it derives its energy and digital materials primarily from volunteer involvement and participation.
        </p>
        <p>
          The source code for the app and the cloud service are both on <a href="https://github.com/earthstewards">github</a>. If you think you may want to contribute to its ongoing development, please take a look at the <a href="">contributing guidelines</a>. If you're interested in contributing to the development of the back-end service, we suggest that you start by launching your own instance of the service in your aws account.
        </p>
        <p>
          Our primary goal is to solve the dilemma that this platform cannot exist, flourish and continually evolve without valuable contributions from people around the world.
        </p>
        <p>
          Particularly pertinent, especially at this stage, are contributions that enable more people to effectively contribute to the various aspects of this project that they would like to contribute to.
        </p>
        <p>
          The Litter Map is a free, open and transparent project that invites you to contribute to any part of it. At the current moment, the most important aspects to contribute to are:
        </p>
        <ul>
          <li>
            Build the app and the back-end service
          </li>
          <li>
            Help to build the community of contributors and early users
          </li>
          <li>
            Find ways to make the project easier to contribute to
          </li>
        </ul>
        <p>
          Monetary contributions to help the project will soon be possible through a transparent donation platform.
        </p>
        <p>
          By all means, hang out in our <a href="https://discord.gg/JvEQMSQaYr">discord channel</a>.
        </p>
        <h2>The Earth Stewards</h2>
        <p>
          The Earth Stewards is an initiative to bring people together over taking stewardship of the planet we call home. You can support us by joining an initiative or purchasing our merchandise.
        </p>
        <p>
          See our website: <a href="https://www.theearthstewards.com/">The Earth Stewards</a>
        </p>
        <h2>Terms of Service</h2>
        <p>
          Our <Link href="/terms">terms</Link> are designed to recognize that you own the content that you contribute.
        </p>
      </div>
    </div>
  )
}
