# 🍕 Slice City — Pizza Tycoon

Start with one pizza counter and build a city-wide pizza empire. Cook customer orders, earn tips, upgrade your equipment, and hire a crew to run your shops.

**[Play the game →](https://a-pizza-game.netlify.app/)**

Play directly in your browser. No installation or account is required, and all purchases use in-game money.

## How to play

1. Read the customer's order and select the ingredients.
2. Bake the pizza, then serve it to earn money. You can remake it anytime before serving.
3. Complete accurate orders for tips and build perfect-pizza streaks for extra cash.
4. Spend your earnings on equipment, new shops, and workers.
5. Own all **six shops** and assign **three workers to each** to complete the campaign. Keep playing after you win.

Each day runs from **8 AM to 6 PM** and lasts four real minutes while the game is running. There is no customer limit. Shops close automatically at the end of the day; open the next day when you are ready.

Customer patience starts when you add the first ingredient. Remaking a pizza does not reset it. Use **Pause** whenever you need a break; popup menus and hidden browser tabs also pause the game.

## Build your business

| Screen | What you can do |
| --- | --- |
| Kitchen | Prepare, bake, and serve pizzas at your current shop. |
| City map | Expand your business and visit any shop you own. |
| Crew | Hire workers and assign them to shops or the bench. |
| Quest log | Track revenue, recent sales, and campaign progress. |
| Equipment | Upgrade baking speed, customer patience, and tips. |
| Trophies | Track ten achievements. |

Workers automatically prepare, bake, and sell pizzas at every staffed shop during opening hours. More workers and better equipment speed up production. Use **Take control** to cook manually, or **Let crew run this shop** to return to automatic service.

Each shop has its own equipment and kitchen progress. Switching shops preserves unfinished pizzas and baking progress until closing time. The clock and crew continue working while you browse the city map, crew, and quest log.

New locations unlock on days **3, 6, 9, 12, and 15**. Starting on day **6**, rotating events add special recipes, price bonuses, and optional cash-reward challenges: Farmers' market, Lunch rush, Food critic, White pizza day, and Pizza festival.

## Save your progress

The game autosaves locally in your browser and provides **three independent save slots**. Open **Save games** to switch or rename saves, delete a save, or export and import a JSON backup.

Saves belong to the browser and website address where you play. They do not automatically sync across devices or between different hosting addresses. Export a backup before moving to another browser or website, then import it there. Importing replaces all three current save slots after confirmation.

If browser storage is unavailable, saves only last for the current visit. Offline time does not advance the game.

## Keyboard controls

| Key | Action |
| --- | --- |
| **B** | Bake |
| **S** | Serve |
| **R** | Remake |
| **P** | Pause or resume |

Shortcuts do not interrupt typing or open menus. Sound is optional and starts off.

## Run locally

Keep `index.html`, `style.css`, and `script.js` in the same folder, then open `index.html` in your browser. No dependencies or build step are needed.

Alternatively, from the project folder run:

```sh
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000).

## Publish on Netlify

Upload `pizza-game-public.zip`, or a folder containing `index.html`, `style.css`, and `script.js`, to [Netlify Drop](https://app.netlify.com/drop).

To update the existing website, upload the latest game files through that project's deploy page in Netlify.

## Run checks

With Node.js installed:

```sh
node tests/run.mjs
```

On macOS, you can use Swift instead:

```sh
swift tests/run.swift
```

The checks cover cooking, saves, upgrades, workers, store management, daily events, opening hours, and campaign completion. They model browser behaviour; visual changes still need a browser check.
