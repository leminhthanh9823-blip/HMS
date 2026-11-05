import React from "react";

export default function HomePage() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="/">
          HMS
        </a>
        <nav aria-label="Main navigation">
          <p className="sidebar-label">QUẢN TRỊ</p>
          <a className="nav-item active" href="/">
            Tổng quan
          </a>
        </nav>
      </aside>
      <section className="content">
        <header className="topbar">
          <span>Homestay Management System</span>
          <span className="badge">Prototype</span>
        </header>
        <div className="welcome">
          <p className="eyebrow">HOMESTAY MANAGEMENT SYSTEM</p>
          <h1>HMS</h1>
          <p>Ứng dụng quản trị đang sẵn sàng để phát triển.</p>
        </div>
      </section>
    </main>
  );
}
