# Greek Fit Kitchen (Healthy Meal Prep Project)

> **BIG GREEK FLAVOUR. ZERO MEAL PREP.**  
> Authentic Mediterranean high-protein fitness meal preparation business based in Etobicoke, Toronto (GTA).

---

## 🍽️ Project Overview

**Greek Fit Kitchen** is a modern, responsive online meal ordering and operations management platform featuring:

- **21 Chef-Crafted Dishes**: All priced accurately in CAD ($9.99 – $14.99 CAD) with dietary labels (High Protein, Halal, Gluten-Free, Omega-3, Vegetarian).
- **Interactive Meal Customizer**: 2 complimentary sides per plate (*Pasta al Greco* excluded), additional sides at $4.99 CAD each, macro add-ons, and special instructions.
- **Minimum Order & Volume Savings**: 6-meal minimum order gating with an automatic **10% volume discount on 7+ meals**.
- **Tiered GTA Delivery Engine**:
  - Distance $\le$ 2.0 km: **FREE** ($0.00 CAD)
  - Distance 2.0 – 5.0 km: **$5.00 CAD Flat**
  - Distance > 5.0 km: **$1.00/km for the full distance**
  - Commercial Kitchen Pickup (3575 Lake Shore Blvd W, Etobicoke): **FREE**
- **Scheduled Batch Drops**: Twice-weekly batch prep (Sunday & Wednesday drops with cutoff countdown timer).
- **Standalone Checkout**: Google-style address autocomplete, 13% Ontario HST calculations, credit card payment simulation, and instant printable receipts.
- **Live 5-Stage Order Tracking**: Real-time batch progress timeline with simulated SMS/Email notifications.
- **Operations & Management Suite (`admin.html`)**: 8-tab administration console for Dashboard Analytics, Order Processing & Refunds, Menu & Pricing Editor, Package Bundles, Sides & Add-ons, Delivery & Tax Settings, Promo Coupons, and Role-Based Access Control (Admin PIN `1234`, Kitchen Staff PIN `2233`, Courier PIN `4455`).

---

## 📁 Key Files & Architecture

- `index.html`: Responsive homepage featuring hero carousel, fresh ingredients showcase, 21-dish menu catalog, batch drops, and reviews.
- `menu.html`: Dedicated full-menu experience with 1-click starter package selector, dish builder, and slide-out cart drawer.
- `checkout.html`: Multi-step checkout with delivery scheduling, address distance validator, and payment authorization.
- `admin.html`: Standalone business operations portal with 8 modular management views.
- `delivery-rates.html`: Comprehensive GTA delivery schedule guide with live distance lookup calculator.
- `about-us.html`: The story of George the Greek and the culinary philosophy.
- `how-it-works.html`: 3-step meal prep guide and reheating/storage instructions.
- `js/app.js`: Complete business logic engine, cart calculations, coupon validator, and localStorage state persistence.
- `js/menu-data.json`: Static JSON data repository for all 21 chef dishes.
- `images/`: High-resolution, title-accurate culinary photography for every dish.

---

## 🚀 Local Development

Open `index.html` directly in any web browser, or launch using any static file server:

```bash
# Python
python -m http.server 8080

# Node.js npx
npx.cmd serve -l 8080
```

Access at `http://localhost:8080/`.

---

## 📄 License & Ownership

Private and proprietary project for Greek Fit Kitchen / LeanMeal.ca.
