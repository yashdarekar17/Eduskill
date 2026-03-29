export default function Footer() {
  return (
    <footer className="w-full max-w-[1400px] mx-auto py-32 px-6 border-t border-black/5 mt-32">
      <div className="mb-16 text-black font-black uppercase text-xs tracking-widest">
        Questions? Call{" "}
        <a href="tel:0008009191694" className="underline hover:text-black/60 transition-colors">
          000-800-919-1694
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        <ul className="space-y-4 text-[13px] font-bold text-black/40 uppercase tracking-tight">
          <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Investor Relations</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Privacy</a></li>
          <li className="pt-4">
            <div className="relative inline-block text-left">
              <select className="appearance-none bg-black text-white px-8 py-3 pr-12 rounded-full font-black text-[10px] uppercase tracking-widest border-none cursor-pointer outline-none shadow-xl hover:bg-gray-800 transition-all">
                <option>English</option>
                <option>Hindi</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </li>
        </ul>

        <ul className="space-y-4 text-[13px] font-bold text-black/40 uppercase tracking-tight">
          <li><a href="#" className="hover:text-black transition-colors">Help Centre</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Media Centre</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Jobs</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Ways to Watch</a></li>
        </ul>

        <ul className="space-y-4 text-[13px] font-bold text-black/40 uppercase tracking-tight">
          <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Account</a></li>
          <li><a href="#" className="hover:text-black transition-colors">Cookie Preferences</a></li>
        </ul>

        <div className="flex flex-col justify-end items-end">
          <span className="text-[40px] font-black text-black tracking-tighter leading-none mb-4">EDUSKILL.</span>
          <div className="text-[10px] text-black/20 font-black uppercase tracking-[0.4em]">Learn and Build</div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-black/5 text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">
        © 2026 Eduskill. All rights reserved. Premium Learning Experience.
      </div>
    </footer>
  );
}
