export default function Footer() {
  return (
    <footer className="max-w-[70vw] mx-auto py-20 border-t border-gray-200 mt-20">
      <div className="mb-10 text-gray-700 font-medium">
        Questions? Call{" "}
        <a href="tel:0008009191694" className="underline hover:text-[#FF6643] transition-colors">
          000-800-919-1694
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <ul className="space-y-4 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:underline">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Investor Relations
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Privacy
            </a>
          </li>
          <li className="pt-2">
            <div className="relative inline-block text-left">
              <select className="appearance-none bg-[#FF6643] text-white px-6 py-2 pr-10 rounded font-bold border-none cursor-pointer outline-none shadow-sm hover:bg-[#e65c00] transition-all">
                <option>English</option>
                <option>Hindi</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </li>
        </ul>

        <ul className="space-y-4 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:underline">
              Help Centre
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Media Centre
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Jobs
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Ways to Watch
            </a>
          </li>
        </ul>

        <ul className="space-y-4 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Account
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Cookie Preferences
            </a>
          </li>
        </ul>

        <ul className="space-y-4 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:underline">
              Corporate Information
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Communications Preferences
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Ad Choices
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-300 text-xs text-gray-600">
        © 2024 Eduskill. All rights reserved.
      </div>
    </footer>
  );
}
