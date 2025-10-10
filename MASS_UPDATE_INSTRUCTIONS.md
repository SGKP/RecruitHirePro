# MASS UI UPDATE SCRIPT
# Run these find-replace operations across ALL .js files

## 1. REMOVE OLD BACKGROUND GRADIENTS
FIND: className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
REPLACE: className="min-h-screen

## 2. UPDATE WHITE CARDS TO GLASS CARDS
FIND: className="bg-white rounded
REPLACE: className="card-modern

FIND: bg-white shadow
REPLACE: card-modern

FIND: bg-white p-
REPLACE: card-modern p-

## 3. UPDATE BUTTONS
FIND: className="bg-blue-600
REPLACE: className="btn-primary

FIND: bg-blue-500
REPLACE: btn-primary

FIND: hover:bg-blue-700
REPLACE: (remove - already in btn-primary)

## 4. UPDATE TEXT COLORS
FIND: text-slate-800
REPLACE: text-gray-200

FIND: text-slate-700
REPLACE: text-gray-300

FIND: text-slate-600
REPLACE: text-gray-400

## 5. UPDATE INPUTS
FIND: border border-gray-300 focus:ring-2
REPLACE: input-modern

## 6. REMOVE EMOJIS
FIND: 🏦|📊|💼|🎯|📅|🏆|✅|❌|🔍|📄|📝|🌟|💡|🚀|🔥|⚡|📱|🎓|📚|🏢|👥|🧭
REPLACE: (empty)

---

Since you need this done fast for demo, let me update the key pages one by one:
