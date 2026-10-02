# Slice City — Pizza Tycoon

A browser game with a kitchen, city map, named crew, equipment, quests, and a campaign objective. There are no real purchases or external dependencies.

Open `index.html` directly in your browser. No install or build step is required. You can also run `python3 -m http.server 8000` and visit http://localhost:8000.

## Playing

- Read the order, tap ingredients, bake, then serve. You can remake a pizza anytime before serving, including during baking. Recipe mistakes are never called out in sale feedback.
- Patience starts at your first ingredient. You get 75 seconds initially, decreasing by 3 seconds per day to a minimum of 60. Remaking does not reset the timer.
- Days run from **8 AM to 6 PM**. The clock advances one minute every 0.4 seconds, showing every minute in order. Five in-game minutes pass every two real seconds, so a day lasts four real minutes. Serve as many customers as you can; there is no order cap. Shops close automatically at 6 PM and show a daily summary. Open the next day when you’re ready.
- Accurate orders earn tips. Consecutive perfect pizzas earn an extra $0.25 per streak step, capped at $2 per order.
- Reinvest available money in a faster oven, extra customer patience, and larger tips. Each equipment upgrade has three levels; the third unlocks on day 6. Spending does not reduce lifetime earnings.
- Unlock ten milestones and follow recent sales in the counter diary.
- Pause with the toolbar button. Menus and hidden tabs automatically pause both customer patience and baking. Optional sound starts off.
- Keyboard shortcuts: **B** bake, **S** serve, **R** remake, **P** pause/resume. Shortcuts do not interfere with typing or open menus.

## Game screens

**Kitchen** is the playable pizza station. **City map** shows six locations; click an owned shop to visit its kitchen. **Crew** lists every worker and lets you select their assignment. **Quest log** tracks revenue and the campaign objective. The clock and crew keep working on the map, crew, and quest screens. Use the Pause button to stop the whole game. Popup dialogs and hidden browser tabs pause all work; offline time does not advance the day.

Every location has its own equipment, income, sales count, unfinished pizza, and oven progress. Switching locations preserves the current kitchen. All shops share the same opening hours and customer counter. At 6 PM, all shops close and unfinished pizzas are cleared. Opening a new day resets the clock to 8 AM and clears daily customer counters.

Own all six shops and assign three workers to each to complete the campaign. You can continue playing after winning.

## Stores and workers

Open **Stores & workers** to grow your business. Five additional locations unlock on days 3, 6, 9, 12, and 15 and cost $200, $400, $750, $1,250, and $2,000. Buy them in order, then staff each store with up to three workers. Hiring costs $75, $125, and $200 per worker; these are one-time costs.

Workers at **every staffed shop** automatically prepare ingredients, bake pizzas, serve customers, and earn money throughout opening hours. That includes the shop you’re visiting: hire a worker and the crew runs it without any clicks. More workers and better equipment speed up production. Every sale updates that shop’s earnings and sales count, your available funds, and lifetime totals. Unstaffed stores need you to cook manually.

The kitchen’s **Take control** button switches the current shop to manual play. **Let crew run this shop** returns it to autopilot. Other staffed shops keep working regardless of your current kitchen mode.

You can hire up to three workers at your original shop for $60, $100, and $150. All workers have names and can move between owned stores for free. Each store holds three workers; the bench holds unassigned workers. Finish baking before moving staff into or out of the active kitchen. The total crew limit is eighteen.

## After day 5

Starting on day 6, five daily events rotate:

- Farmers’ market: veggie recipes and 35% higher order prices.
- Lunch rush: 12 fewer seconds of patience and 25% higher prices.
- Food critic: a VIP fifth customer with a custom order at double the normal price.
- White pizza day: cheese-based recipes without tomato sauce and 30% higher prices.
- Pizza festival: bigger topping combinations, 8 extra seconds, and 40% higher prices.

Each event has a clear optional challenge and a $30 bonus, growing by $10 on every five-day cycle. Completed bonuses are saved and paid only once. Store expansions, staffing, advanced equipment, and new milestones provide longer-term goals.

## Saves

Three independent save slots retain shop names, earnings, upgrades, workers, store ownership, per-shop equipment, worker jobs, the current time, kitchen control modes, named worker assignments, challenge progress, and milestones. Existing save data migrates automatically. Progress is saved locally in this browser; if storage is unavailable, the app displays that saves only last for the current visit. Offline time does not consume patience.

Open **Save slots** to switch or rename shops, delete individual saves, or export all saves to a JSON backup. Importing a backup asks before replacing current saves. Deleting the active shop loads another shop or opens a fresh shop in another slot. Deleted slots stay empty until selected.

**Restart this shop** clears just the active save. **Restart everything** clears all three, with confirmation.

## Checks

Run `node tests/run.mjs` if Node.js is installed. On macOS, run `swift tests/run.swift` instead. Both exercise the same dependency-free game tests: cooking controls, topping placement, remake, pause, upgrades, daily progression, saves, backups, deletion, restarts, migration, storage recovery, store purchases, hiring, branch earnings, late-game challenges, shop switching, per-shop equipment, worker transfers, campaign completion, opening hours, unlimited customers, and fully automatic worker production. These checks model browser behaviour; they do not replace a visual browser check.

The previous personal website is preserved in `personal-site/`.
