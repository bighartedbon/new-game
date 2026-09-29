# 2D Platformer - Level 1 Prototype

A light, modular 2D browser-based platformer built using **HTML5 Canvas** and **Vanilla JavaScript** (ES6 Modules). This project implements the core gameplay mechanics and environment layout designed for Level 1 of the game.

---

## 🎮 Gameplay Overview

In Level 1, the player controls a small character who navigates a vertical sequence of step-like platforms. The objective is to jump across ascending platforms to reach and eat the fruit located at the top platform, scoring points before descending down the opposite side.

### Core Features
- **Player Physics & Controls:** Responsive horizontal movement, jumping, and gravity handling.
- **Dynamic Platform Collision:** Solid platform detection allowing precise landing and step navigation.
- **Collectible System:** Interactive fruit item at the peak platform (Step 3) with touch detection that updates player points.
- **Heads-Up Display (HUD):** Dynamic top-level score and level indicators rendered over the viewport.
- **Bounding Boundaries:** Floor and canvas walls to keep player within the playable canvas area.

---

## 📐 Level Design Specification

The level geometry directly mirrors the initial conceptual paper prototype:

```text
       +---------------------------------------------+
       | LEVEL: 1                         SCORE: 0   |
       |                                             |
       |                   [Fruit]                   |
       |                 +---------+ (Step 3)        |
       |                 |         |                 |
       |    (Step 4) +---+         +---+ (Step 2)    |
       |             |                 |             |
       |  (Step 5) +-+                 +-+ (Step 1)  |
       |           |   [Player Start]    |           |
       +---------------------------------------------+
