import { Link } from '@tanstack/react-router'
import { Image } from "@unpic/react";
import NewsLetter from "@/components/NewsLetter.tsx";

const Footer = () => {
  return (
    // background: linear-gradient(180.88deg, #01B1A8 0.22%, #0185B6 99.24%);
    <footer className="shadow-none font-poppins">
      <div className="flex bg-gradient-to-b py-8 sm:py-16 from-[#01B1A8] to-[#0185B6]">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 sm:gap-6 sm:grid-cols-4">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <Image src="/footer-logo.png" width={238} height={36} className="h-8 me-3" alt=" Logo" />
              </Link>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-[#fff100] capitalize dark:text-white">About </h2>
              <ul className="text-background text-sm font-medium space-y-4">
                <li>
                  <Link to="/about" className="hover:underline">About Us</Link>
                </li>
                <li>
                  <Link to="/how-to-play" className="hover:underline">How to play</Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:underline">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-bold text-[#fff100] capitalize dark:text-white">Quick links</h2>
              <ul className="text-white text-sm font-medium space-y-4">
                <li>
                  <Link to="/profile" className="hover:underline">My Account</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:underline">Affiliate Program</Link>
                </li>
                <li>
                  <Link to="/terms-and-condition" className="hover:underline">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/responsible-gambling" className="hover:underline">Responsible Gaming</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-bold text-[#fff100] capitalize dark:text-white">email newsletters</h2>
              <ul className="text-white text-sm font-medium">
                <li className="mb-4">
                  Subscribe now and receive weekly newsletter for latest draw and offer news and much more!
                </li>
                <li className="mb-0">
                   <NewsLetter />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex bg-white sm:items-center sm:justify-between">
        <div className="mx-auto w-full max-w-screen-xl  px-10 py-8 lg:py-8">
          <div className="flex mb-4 gap-4 justify-center sm:justify-center sm:mt-0">
            <Image src={"/payment.png"} width={118} height={21} alt="Payment Method" />
            <Image src={"/gamify.png"} width={92} height={32} alt="Gamify" />
            <Image src={"/responsible-bet.png"} width={50} height={50} alt="Responsible Bet" />
          </div>
          <span className="text-sm flex justify-center text-muted-foreground text-center dark:text-gray-400">© {new Date().getFullYear()} <Link to="/" className="hover:underline"> MaxiLotto</Link>. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>

  )
}

export default Footer