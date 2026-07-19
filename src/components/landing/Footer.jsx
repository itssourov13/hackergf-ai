import React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Terminal, Github, Twitter, MessageCircle } from "lucide-react";
import { APP_CONFIG, NAV_LINKS, SOCIAL_LINKS } from "@/lib/config/constants";

export default function Footer() {
  return (
    <footer className="border-t border-red-950/30 bg-black">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/30">
                  <Terminal className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-lg font-bold text-white">
                  Hacker <span className="text-red-500">gf</span>
                </span>
              </Link>
              <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
                {APP_CONFIG.description}
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-300 mb-4">Product</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-zinc-500 hover:text-red-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-300 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-sm text-zinc-500 hover:text-red-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-sm text-zinc-500 hover:text-red-400 transition-colors">Get Started</Link></li>
                <li><span className="text-sm text-zinc-500">Privacy Policy</span></li>
                <li><span className="text-sm text-zinc-500">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved. v{APP_CONFIG.version}
            </p>
            <p className="text-xs text-zinc-600">
              Built with React, Tailwind CSS & Base44
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}