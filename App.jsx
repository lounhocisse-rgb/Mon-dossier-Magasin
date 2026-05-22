import React, { useState, useMemo } from 'react';
import { Search, MapPin, ShoppingCart, User, Briefcase, Plus, Trash2, Check, X, Package, PackagePlus, AlertCircle, ChevronRight, Edit3, Save, DoorOpen, ScanLine, Loader, Globe, Database, Move, ArrowRight, Sun, Moon, Heart, Sparkles, TrendingUp, ArrowUpRight, Navigation } from 'lucide-react';

const FONTS_LINK = (
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@500;600;700&display=swap" />
);

const STYLES = `
  * { -webkit-font-smoothing: antialiased; }
  .font-sans { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
  .font-hand { font-family: 'Caveat', cursive; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
  .animate-fade-up { animation: fadeUp 0.4s ease-out forwards; }
  .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
  .dark-app ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
`;

const AISLES = {
  1: { section: 'Produits naturels', accent: 'green',
    left: ['Produits laitiers', 'Substituts de lait', 'Sans gluten', 'Produits surgelés'],
    right: ['Céréales', 'Café', 'Boissons de soya', 'Jus'] },
  2: { section: 'Produits naturels', accent: 'green',
    left: ['Pâtes alimentaires', 'Sauces', 'Soupes', 'Produits de cuisson'],
    right: ['Croustilles', 'Barres tendres', 'Biscuits', 'Confiserie'] },
  3: { section: 'Épicerie', accent: 'red',
    left: ['Couches', 'Soins pour bébés', 'Préparation pour nourrissons', 'Nourriture pour bébés'],
    right: ['Soins dentaires', 'Soins personnels', 'Hygiène féminine', 'Shampoings'] },
  4: { section: 'Épicerie', accent: 'red',
    left: ['Nourriture pour chiens', 'Nourriture pour chats', 'Brosses et balais', 'Sacs à ordures'],
    right: ['Produits pour la lessive', "Purificateurs d'air", 'Produits de nettoyage', 'Savon à vaisselle'] },
  5: { section: 'Épicerie', accent: 'red',
    left: ['Papier hygiénique', 'Essuie-tout', 'Emballage pour aliments', 'Ampoules'],
    right: ['Vinaigrettes', 'Condiments', 'Marinades', 'Assiettes jetables'] },
  6: { section: 'Épicerie', accent: 'red',
    left: ['Riz', 'Nouilles asiatiques', 'Produits asiatiques', 'Produits chinois'],
    right: ['Produits ethniques', 'Produits moyen-orient', 'Légumineuses', 'Produits mexicains'] },
  7: { section: 'Épicerie', accent: 'red',
    left: ['Huile', "Plats d'accompagnement", 'Légumes en conserve', 'Poisson en conserve'],
    right: ['Pâtes alimentaires', 'Sauces pour pâtes', 'Sauces', 'Épices'] },
  8: { section: 'Épicerie', accent: 'red',
    left: ['Soupes', 'Biscuits soda', 'Craquelins', 'Galettes de riz'],
    right: ['Préparation à gâteaux', 'Farine', 'Produits de cuisson', 'Sucre'] },
  9: { section: 'Épicerie', accent: 'red',
    left: ['Café', 'Thé et tisanes', 'Lait évaporé', 'Barres tendres'],
    right: ['Céréales', 'Céréales chaudes', 'Sirop', 'Tartinades'] },
  10: { section: 'Épicerie', accent: 'red',
    left: ['Confiserie', 'Biscuits', 'Compotes', 'Poudings'],
    right: ['Croustilles', 'Maïs soufflé', 'Noix', 'Vrac'] },
  11: { section: 'Épicerie', accent: 'red',
    left: ['Jus de légumes', 'Jus et boissons', 'Jus en boîtes', 'Eau de source'],
    right: ['Boissons gazeuses', 'Boissons non gazeuses', 'Boissons énergétiques', 'Boissons isotoniques'] }
};

// Libellés courts par allée pour le plan (vrai magasin)
const AISLE_LABELS = {
  1: 'Bio & laitiers', 2: 'Pâtes & collations', 3: 'Bébé & soins',
  4: 'Animaux & ménage', 5: 'Papier & condiments', 6: 'Riz & international',
  7: 'Huile, pâtes & épices', 8: 'Soupes & cuisson', 9: 'Café & déjeuner',
  10: 'Sucreries & noix', 11: 'Jus & boissons'
};

const PERIMETER_ZONES = {
  'fruits-legumes': { name: 'Fruits & légumes', emoji: '🍎', color: '#16a34a', bg: '#dcfce7', bgDark: '#14532d' },
  'boulangerie': { name: 'Boulangerie', emoji: '🥖', color: '#d97706', bg: '#fef3c7', bgDark: '#78350f' },
  'pret-a-manger': { name: 'Prêt-à-manger', emoji: '🥗', color: '#ea580c', bg: '#fed7aa', bgDark: '#7c2d12' },
  'fleurs': { name: 'Fleurs', emoji: '🌷', color: '#db2777', bg: '#fce7f3', bgDark: '#831843' },
  'charcuterie': { name: 'Charcuterie', emoji: '🥓', color: '#dc2626', bg: '#fee2e2', bgDark: '#7f1d1d' },
  'viandes': { name: 'Viandes', emoji: '🥩', color: '#b91c1c', bg: '#fecaca', bgDark: '#7f1d1d' },
  'poissonnerie': { name: 'Poissonnerie', emoji: '🐟', color: '#0284c7', bg: '#e0f2fe', bgDark: '#0c4a6e' },
  'surgeles': { name: 'Surgelés', emoji: '🧊', color: '#0891b2', bg: '#cffafe', bgDark: '#164e63' },
  'produits-laitiers': { name: 'Produits laitiers', emoji: '🥛', color: '#2563eb', bg: '#dbeafe', bgDark: '#1e3a8a' }
};

const PHOTOS = {
  'pomme': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop&auto=format',
  'banane': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&auto=format',
  'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop&auto=format',
  'citron': 'https://images.unsplash.com/photo-1582287014914-1db836463f76?w=300&h=300&fit=crop&auto=format',
  'raisin': 'https://images.unsplash.com/photo-1599819177626-aab5e3413086?w=300&h=300&fit=crop&auto=format',
  'fraise': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&auto=format',
  'bleuet': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&h=300&fit=crop&auto=format',
  'framboise': 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=300&h=300&fit=crop&auto=format',
  'ananas': 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=300&h=300&fit=crop&auto=format',
  'mangue': 'https://images.unsplash.com/photo-1605027990121-cbae9e0642db?w=300&h=300&fit=crop&auto=format',
  'avocat': 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=300&h=300&fit=crop&auto=format',
  'melon': 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=300&h=300&fit=crop&auto=format',
  'poire': 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=300&h=300&fit=crop&auto=format',
  'pêche': 'https://images.unsplash.com/photo-1595124953037-26b8fdacaf85?w=300&h=300&fit=crop&auto=format',
  'cerise': 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=300&h=300&fit=crop&auto=format',
  'kiwi': 'https://images.unsplash.com/photo-1610917040803-1fccf9623064?w=300&h=300&fit=crop&auto=format',
  'clémentine': 'https://images.unsplash.com/photo-1542887243-bce46baceac2?w=300&h=300&fit=crop&auto=format',
  'tomate': 'https://images.unsplash.com/photo-1546470427-f5e5ba7d7d63?w=300&h=300&fit=crop&auto=format',
  'concombre': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300&h=300&fit=crop&auto=format',
  'poivron': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop&auto=format',
  'carotte': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop&auto=format',
  'céleri': 'https://images.unsplash.com/photo-1580294672096-a07c7e51e85b?w=300&h=300&fit=crop&auto=format',
  'brocoli': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop&auto=format',
  'chou-fleur': 'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=300&h=300&fit=crop&auto=format',
  'laitue': 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=300&h=300&fit=crop&auto=format',
  'épinard': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop&auto=format',
  'salade': 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&h=300&fit=crop&auto=format',
  'oignon': 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=300&h=300&fit=crop&auto=format',
  'ail': 'https://images.unsplash.com/photo-1615477550927-6ec8da8a4a3d?w=300&h=300&fit=crop&auto=format',
  'gingembre': 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=300&h=300&fit=crop&auto=format',
  'pomme de terre': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop&auto=format',
  'patate': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop&auto=format',
  'champignon': 'https://images.unsplash.com/photo-1607149612055-49baa72e88c9?w=300&h=300&fit=crop&auto=format',
  'maïs': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=300&fit=crop&auto=format',
  'courgette': 'https://images.unsplash.com/photo-1596557072053-9d6c9e1c25b6?w=300&h=300&fit=crop&auto=format',
  'aubergine': 'https://images.unsplash.com/photo-1659261200625-c1d7a9b6cfa0?w=300&h=300&fit=crop&auto=format',
  'asperge': 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777?w=300&h=300&fit=crop&auto=format',
  'persil': 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&h=300&fit=crop&auto=format',
  'basilic': 'https://images.unsplash.com/photo-1538596313828-41d729090199?w=300&h=300&fit=crop&auto=format',
  'coriandre': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop&auto=format',
  'pain': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&auto=format',
  'baguette': 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=300&h=300&fit=crop&auto=format',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop&auto=format',
  'chocolatine': 'https://images.unsplash.com/photo-1623334044303-241021148842?w=300&h=300&fit=crop&auto=format',
  'bagel': 'https://images.unsplash.com/photo-1592151450103-7eecd1bd5c1e?w=300&h=300&fit=crop&auto=format',
  'muffin': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&h=300&fit=crop&auto=format',
  'tarte': 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=300&h=300&fit=crop&auto=format',
  'beigne': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=300&fit=crop&auto=format',
  'brioche': 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?w=300&h=300&fit=crop&auto=format',
  'pita': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=300&h=300&fit=crop&auto=format',
  'tortilla': 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&h=300&fit=crop&auto=format',
  'pâte à pizza': 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=300&h=300&fit=crop&auto=format',
  'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=300&fit=crop&auto=format',
  'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop&auto=format',
  'wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=300&fit=crop&auto=format',
  'salade préparée': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop&auto=format',
  'poulet rôti': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=300&fit=crop&auto=format',
  'soupe du jour': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop&auto=format',
  'bouquet': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop&auto=format',
  'rose': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&auto=format',
  'tulipe': 'https://images.unsplash.com/photo-1599631438215-75bc2640feb8?w=300&h=300&fit=crop&auto=format',
  'tournesol': 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=300&fit=crop&auto=format',
  'plante': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop&auto=format',
  'orchidée': 'https://images.unsplash.com/photo-1610978478977-1ad77ddff7bd?w=300&h=300&fit=crop&auto=format',
  'jambon': 'https://images.unsplash.com/photo-1599050751781-e8c5b3dba1c1?w=300&h=300&fit=crop&auto=format',
  'salami': 'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?w=300&h=300&fit=crop&auto=format',
  'pepperoni': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop&auto=format',
  'bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=300&h=300&fit=crop&auto=format',
  'saucisse': 'https://images.unsplash.com/photo-1601565415267-724db0e9fa86?w=300&h=300&fit=crop&auto=format',
  'bœuf haché': 'https://images.unsplash.com/photo-1602470521006-1c5ca5a7e74e?w=300&h=300&fit=crop&auto=format',
  'steak': 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=300&h=300&fit=crop&auto=format',
  'poulet': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop&auto=format',
  'porc': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop&auto=format',
  'agneau': 'https://images.unsplash.com/photo-1602476105532-9842b88a32d4?w=300&h=300&fit=crop&auto=format',
  'saumon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=300&fit=crop&auto=format',
  'truite': 'https://images.unsplash.com/photo-1535999686137-6cbef2d92ebc?w=300&h=300&fit=crop&auto=format',
  'morue': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=300&h=300&fit=crop&auto=format',
  'crevette': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&h=300&fit=crop&auto=format',
  'homard': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=300&h=300&fit=crop&auto=format',
  'pizza surgelée': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop&auto=format',
  'crème glacée': 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300&h=300&fit=crop&auto=format',
  'sorbet': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=300&fit=crop&auto=format',
  'frites': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop&auto=format',
  'légumes surgelés': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop&auto=format',
  'lasagne': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=300&fit=crop&auto=format',
  'lait': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop&auto=format',
  'yogourt': 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=300&h=300&fit=crop&auto=format',
  'fromage': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop&auto=format',
  'cheddar': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300&h=300&fit=crop&auto=format',
  'mozzarella': 'https://images.unsplash.com/photo-1626957341926-98752fc2bbb6?w=300&h=300&fit=crop&auto=format',
  'feta': 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=300&h=300&fit=crop&auto=format',
  'beurre': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop&auto=format',
  'œuf': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop&auto=format',
  'crème': 'https://images.unsplash.com/photo-1631515243348-a2c8893bbeae?w=300&h=300&fit=crop&auto=format',
  'pâtes': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=300&fit=crop&auto=format',
  'spaghetti': 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=300&h=300&fit=crop&auto=format',
  'penne': 'https://images.unsplash.com/photo-1626844131082-256783844137?w=300&h=300&fit=crop&auto=format',
  'sauce tomate': 'https://images.unsplash.com/photo-1612869538502-bfe6e80e34d0?w=300&h=300&fit=crop&auto=format',
  'soupe': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop&auto=format',
  'huile': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format',
  'riz': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&auto=format',
  'nouilles': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop&auto=format',
  'ramen': 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=300&h=300&fit=crop&auto=format',
  'sauce soya': 'https://images.unsplash.com/photo-1597756283132-cca6f64dc7c1?w=300&h=300&fit=crop&auto=format',
  'tofu': 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=300&h=300&fit=crop&auto=format',
  'lentille': 'https://images.unsplash.com/photo-1611575619267-e4ec55c4ef9d?w=300&h=300&fit=crop&auto=format',
  'pois chiche': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=300&h=300&fit=crop&auto=format',
  'haricot': 'https://images.unsplash.com/photo-1599286176019-fee5ad94e9a3?w=300&h=300&fit=crop&auto=format',
  'salsa': 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&h=300&fit=crop&auto=format',
  'houmous': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=300&h=300&fit=crop&auto=format',
  'thon': 'https://images.unsplash.com/photo-1622180192858-7e1f7d7d4d97?w=300&h=300&fit=crop&auto=format',
  'farine': 'https://images.unsplash.com/photo-1610725663727-08695a1ac3ff?w=300&h=300&fit=crop&auto=format',
  'sucre': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=300&h=300&fit=crop&auto=format',
  'sel': 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=300&h=300&fit=crop&auto=format',
  'poivre': 'https://images.unsplash.com/photo-1599909533730-fed8eaaf5dfe?w=300&h=300&fit=crop&auto=format',
  'épice': 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300&h=300&fit=crop&auto=format',
  'café': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&auto=format',
  'thé': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&h=300&fit=crop&auto=format',
  'tisane': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop&auto=format',
  'céréale': 'https://images.unsplash.com/photo-1517593456320-95355c95ff89?w=300&h=300&fit=crop&auto=format',
  'gruau': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=300&h=300&fit=crop&auto=format',
  'sirop': 'https://images.unsplash.com/photo-1597845014444-f5b3ac3cc52e?w=300&h=300&fit=crop&auto=format',
  'arachide': 'https://images.unsplash.com/photo-1604843046094-225c9aac1f8d?w=300&h=300&fit=crop&auto=format',
  'confiture': 'https://images.unsplash.com/photo-1597314540014-e60293b5e066?w=300&h=300&fit=crop&auto=format',
  'miel': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop&auto=format',
  'chocolat': 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?w=300&h=300&fit=crop&auto=format',
  'biscuit': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop&auto=format',
  'bonbon': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&h=300&fit=crop&auto=format',
  'croustille': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop&auto=format',
  'popcorn': 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=300&fit=crop&auto=format',
  'noix': 'https://images.unsplash.com/photo-1599598425947-5202276f4f64?w=300&h=300&fit=crop&auto=format',
  'amande': 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=300&h=300&fit=crop&auto=format',
  'compote': 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=300&h=300&fit=crop&auto=format',
  'jus': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300&h=300&fit=crop&auto=format',
  'eau': 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=300&h=300&fit=crop&auto=format',
  'cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop&auto=format',
  'soda': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop&auto=format',
  'couche': 'https://images.unsplash.com/photo-1607451312456-7a7a90c41b15?w=300&h=300&fit=crop&auto=format',
  'dentifrice': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=300&fit=crop&auto=format',
  'shampoing': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&auto=format',
  'savon': 'https://images.unsplash.com/photo-1607006677432-bc0e1b3b7f76?w=300&h=300&fit=crop&auto=format',
  'détergent': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&h=300&fit=crop&auto=format',
  'papier hygiénique': 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=300&h=300&fit=crop&auto=format',
  'ketchup': 'https://images.unsplash.com/photo-1607890099758-a13e4d2e1c9c?w=300&h=300&fit=crop&auto=format',
  'moutarde': 'https://images.unsplash.com/photo-1583484964063-2e0e8e6b1e6f?w=300&h=300&fit=crop&auto=format',
  'mayonnaise': 'https://images.unsplash.com/photo-1626501061830-c0baf57c46b3?w=300&h=300&fit=crop&auto=format',
  'beurre arachide': 'https://images.unsplash.com/photo-1604843046094-225c9aac1f8d?w=300&h=300&fit=crop&auto=format',
  'pamplemousse': 'https://images.unsplash.com/photo-1610917040803-1fccf9623064?w=300&h=300&fit=crop&auto=format',
  'mandarine': 'https://images.unsplash.com/photo-1542887243-bce46baceac2?w=300&h=300&fit=crop&auto=format',
  'lime': 'https://images.unsplash.com/photo-1622957461168-202e611b22cd?w=300&h=300&fit=crop&auto=format',
  'mûre': 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=300&h=300&fit=crop&auto=format',
  'canneberge': 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=300&h=300&fit=crop&auto=format',
  'datte': 'https://images.unsplash.com/photo-1601897690942-bbf6f6dd6ea1?w=300&h=300&fit=crop&auto=format',
  'grenade': 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=300&h=300&fit=crop&auto=format',
  'radis': 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=300&h=300&fit=crop&auto=format',
  'betterave': 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=300&h=300&fit=crop&auto=format',
  'chou': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=300&fit=crop&auto=format',
  'haricot vert': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=300&h=300&fit=crop&auto=format',
  'menthe': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&h=300&fit=crop&auto=format',
  'naan': 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=300&h=300&fit=crop&auto=format',
  'quiche': 'https://images.unsplash.com/photo-1591985666643-1ecd9b9c5e0e?w=300&h=300&fit=crop&auto=format',
  'lys': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=300&fit=crop&auto=format',
  'mortadelle': 'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?w=300&h=300&fit=crop&auto=format',
  'cretons': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=300&fit=crop&auto=format',
  'veau': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300&h=300&fit=crop&auto=format',
  'pétoncle': 'https://images.unsplash.com/photo-1559848744-fbe49ce4d9c5?w=300&h=300&fit=crop&auto=format',
  'moule': 'https://images.unsplash.com/photo-1565280654386-466ed3b8ff0a?w=300&h=300&fit=crop&auto=format',
  'crabe': 'https://images.unsplash.com/photo-1582901059880-d8b5dd86fa90?w=300&h=300&fit=crop&auto=format',
  'aiglefin': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=300&h=300&fit=crop&auto=format',
  'pierogi': 'https://images.unsplash.com/photo-1625471519482-5fc1cebe3aab?w=300&h=300&fit=crop&auto=format',
  'burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=300&fit=crop&auto=format',
  'pépites poulet': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=300&fit=crop&auto=format',
  'kéfir': 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=300&h=300&fit=crop&auto=format',
  'cottage': 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=300&h=300&fit=crop&auto=format',
  'margarine': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop&auto=format',
  'couscous': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&h=300&fit=crop&auto=format',
  'quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&auto=format',
  'sardine': 'https://images.unsplash.com/photo-1604982314870-9be8c8c1d9b2?w=300&h=300&fit=crop&auto=format',
  'craquelin': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=300&fit=crop&auto=format',
  'galette riz': 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=300&h=300&fit=crop&auto=format',
  'levure': 'https://images.unsplash.com/photo-1610725663727-08695a1ac3ff?w=300&h=300&fit=crop&auto=format',
  'cassonade': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=300&h=300&fit=crop&auto=format',
  'réglisse': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&h=300&fit=crop&auto=format',
  'gomme': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&h=300&fit=crop&auto=format',
  'pouding': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop&auto=format',
  'pistache': 'https://images.unsplash.com/photo-1599598425947-5202276f4f64?w=300&h=300&fit=crop&auto=format',
  'limonade': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=300&fit=crop&auto=format',
  'eau pétillante': 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=300&h=300&fit=crop&auto=format',
  'thé glacé': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop&auto=format',
  'boisson énergétique': 'https://images.unsplash.com/photo-1622543925917-71b5c63ec906?w=300&h=300&fit=crop&auto=format',
  'boisson sportive': 'https://images.unsplash.com/photo-1622543925917-71b5c63ec906?w=300&h=300&fit=crop&auto=format',
  'lingette': 'https://images.unsplash.com/photo-1607451312456-7a7a90c41b15?w=300&h=300&fit=crop&auto=format',
  'déodorant': 'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=300&h=300&fit=crop&auto=format',
  'rasoir': 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&h=300&fit=crop&auto=format',
  'litière': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&auto=format',
  'nourriture chien': 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop&auto=format',
  'nourriture chat': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&auto=format',
  'sac poubelle': 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&h=300&fit=crop&auto=format',
  'assouplissant': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&h=300&fit=crop&auto=format',
  'javel': 'https://images.unsplash.com/photo-1583947581924-860bda3c5933?w=300&h=300&fit=crop&auto=format',
  'nettoyant': 'https://images.unsplash.com/photo-1583947581924-860bda3c5933?w=300&h=300&fit=crop&auto=format',
  'essuie-tout': 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=300&h=300&fit=crop&auto=format',
  'ampoule': 'https://images.unsplash.com/photo-1607079749814-2c7d22fd6c80?w=300&h=300&fit=crop&auto=format',
  'vinaigrette': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=300&fit=crop&auto=format',
  'tortilla': 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=300&fit=crop&auto=format'
};

// Traduction FR -> EN pour générer des photos par mot-clé en dernier recours
const KEYWORD_EN = {
  'pomme':'apple','banane':'banana','orange':'orange','citron':'lemon','raisin':'grapes','fraise':'strawberry',
  'bleuet':'blueberry','framboise':'raspberry','ananas':'pineapple','mangue':'mango','avocat':'avocado','melon':'melon',
  'poire':'pear','pêche':'peach','cerise':'cherry','kiwi':'kiwi','clémentine':'clementine','tomate':'tomato',
  'concombre':'cucumber','poivron':'bell-pepper','carotte':'carrot','céleri':'celery','brocoli':'broccoli',
  'chou':'cabbage','laitue':'lettuce','épinard':'spinach','salade':'salad','oignon':'onion','ail':'garlic',
  'gingembre':'ginger','patate':'potato','pomme de terre':'potato','champignon':'mushroom','maïs':'corn',
  'courgette':'zucchini','aubergine':'eggplant','asperge':'asparagus','persil':'parsley','basilic':'basil',
  'coriandre':'cilantro','radis':'radish','betterave':'beet','citrouille':'pumpkin','courge':'squash',
  'pain':'bread','baguette':'baguette','croissant':'croissant','bagel':'bagel','muffin':'muffin','tarte':'pie',
  'beigne':'donut','brioche':'brioche','pita':'pita','tortilla':'tortilla','naan':'naan','gâteau':'cake',
  'sushi':'sushi','sandwich':'sandwich','wrap':'wrap','poke':'poke-bowl','quiche':'quiche','soupe':'soup',
  'bouquet':'flower-bouquet','rose':'roses','tulipe':'tulips','tournesol':'sunflower','plante':'plant',
  'orchidée':'orchid','lys':'lily','jambon':'ham','prosciutto':'prosciutto','salami':'salami','pepperoni':'pepperoni',
  'bacon':'bacon','saucisse':'sausage','cretons':'pate','mortadelle':'mortadella','chorizo':'chorizo',
  'bœuf':'beef','boeuf':'beef','steak':'steak','poulet':'chicken','porc':'pork','agneau':'lamb','dinde':'turkey',
  'canard':'duck','veau':'veal','saumon':'salmon','truite':'trout','tilapia':'tilapia','morue':'cod','thon':'tuna',
  'crevette':'shrimp','homard':'lobster','crabe':'crab','moule':'mussels','pétoncle':'scallop','calmar':'squid',
  'pizza':'pizza','crème glacée':'ice-cream','sorbet':'sorbet','frites':'french-fries','lasagne':'lasagna',
  'gaufre':'waffle','crêpe':'pancake','lait':'milk','yogourt':'yogurt','fromage':'cheese','cheddar':'cheddar-cheese',
  'mozzarella':'mozzarella','feta':'feta-cheese','beurre':'butter','œuf':'eggs','oeuf':'eggs','crème':'cream',
  'margarine':'margarine','pâtes':'pasta','spaghetti':'spaghetti','penne':'penne-pasta','nouilles':'noodles',
  'ramen':'ramen','riz':'rice','quinoa':'quinoa','couscous':'couscous','tofu':'tofu','lentille':'lentils',
  'pois chiche':'chickpeas','haricot':'beans','salsa':'salsa','houmous':'hummus','sardine':'sardines',
  'huile':'olive-oil','farine':'flour','sucre':'sugar','sel':'salt','poivre':'pepper','épice':'spices',
  'café':'coffee','thé':'tea','tisane':'herbal-tea','céréale':'cereal','gruau':'oatmeal','sirop':'maple-syrup',
  'confiture':'jam','miel':'honey','chocolat':'chocolate','biscuit':'cookies','bonbon':'candy','réglisse':'licorice',
  'croustille':'potato-chips','chips':'chips','popcorn':'popcorn','noix':'nuts','amande':'almonds','pistache':'pistachio',
  'arachide':'peanuts','compote':'applesauce','pouding':'pudding','jus':'juice','eau':'water','cola':'soda',
  'soda':'soft-drink','limonade':'lemonade','couche':'diapers','dentifrice':'toothpaste','shampoing':'shampoo',
  'savon':'soap','déodorant':'deodorant','rasoir':'razor','détergent':'detergent','lessive':'laundry-detergent',
  'javel':'bleach','nettoyant':'cleaning-spray','papier hygiénique':'toilet-paper','essuie-tout':'paper-towel',
  'ampoule':'light-bulb','ketchup':'ketchup','moutarde':'mustard','mayonnaise':'mayonnaise','vinaigrette':'salad-dressing',
  'nourriture chien':'dog-food','nourriture chat':'cat-food','litière':'cat-litter','sac poubelle':'garbage-bags',
  'craquelin':'crackers','marinade':'bbq-sauce','barre':'granola-bar','boisson énergétique':'energy-drink',
  'boisson sportive':'sports-drink','thé glacé':'iced-tea','tartinade':'spread','sauce':'sauce'
};

// ============================================================
// VIGNETTES PRODUITS — emojis locaux (aucun réseau, affichage garanti)
// Le sandbox des artifacts bloque les images externes, donc on dessine
// des vignettes colorées avec un emoji représentatif de chaque produit.
// ============================================================
const EMOJI_MAP = {
  'pomme':'🍎','banane':'🍌','orange':'🍊','citron':'🍋','lime':'🍋','raisin':'🍇','fraise':'🍓',
  'bleuet':'🫐','framboise':'🫐','mûre':'🫐','ananas':'🍍','mangue':'🥭','avocat':'🥑','melon':'🍈',
  'pastèque':'🍉','melon d\'eau':'🍉','poire':'🍐','pêche':'🍑','nectarine':'🍑','prune':'🍑','cerise':'🍒',
  'kiwi':'🥝','clémentine':'🍊','mandarine':'🍊','pamplemousse':'🍊','datte':'🌰','figue':'🫐','grenade':'🍎',
  'tomate':'🍅','concombre':'🥒','poivron':'🫑','piment':'🌶️','carotte':'🥕','céleri':'🥬','brocoli':'🥦',
  'chou-fleur':'🥦','chou':'🥬','laitue':'🥬','épinard':'🥬','salade':'🥗','roquette':'🥬','kale':'🥬',
  'oignon':'🧅','échalote':'🧅','ail':'🧄','gingembre':'🫚','patate':'🥔','pomme de terre':'🥔',
  'champignon':'🍄','maïs':'🌽','courgette':'🥒','aubergine':'🍆','asperge':'🥬','haricot':'🫛',
  'petits pois':'🫛','radis':'🥬','betterave':'🥬','navet':'🥬','persil':'🌿','coriandre':'🌿','basilic':'🌿',
  'menthe':'🌿','romarin':'🌿','thym':'🌿','aneth':'🌿','citrouille':'🎃','courge':'🎃','panais':'🥕',
  'pain':'🍞','baguette':'🥖','croissant':'🥐','chocolatine':'🥐','danoise':'🥐','bagel':'🥯','muffin':'🧁',
  'tarte':'🥧','beigne':'🍩','brioche':'🍞','pita':'🫓','naan':'🫓','tortilla':'🌯','gâteau':'🎂',
  'pâte':'🥟','scone':'🧁','éclair':'🍰','strudel':'🥧','pâtisserie':'🥐',
  'sushi':'🍣','sandwich':'🥪','wrap':'🌯','panini':'🥪','poke':'🍲','salade préparée':'🥗','quiche':'🥧',
  'poulet rôti':'🍗','côtes levées':'🍖','macaroni':'🧀','soupe':'🍲','rouleau':'🥢','samoussa':'🥟',
  'brochette':'🍢','lasagne':'🍝','pâté':'🥧','pizza fraîche':'🍕',
  'bouquet':'💐','rose':'🌹','tulipe':'🌷','tournesol':'🌻','plante':'🪴','orchidée':'🌸','lys':'🌷',
  'fleur':'🌷','marguerite':'🌼','pivoine':'🌸','hortensia':'🌸','lavande':'💜','succulente':'🪴',
  'cactus':'🌵','carte':'💌','ballon':'🎈',
  'jambon':'🍖','prosciutto':'🥓','salami':'🍖','pepperoni':'🍕','bacon':'🥓','saucisse':'🌭','dinde':'🦃',
  'cretons':'🥫','mortadelle':'🍖','chorizo':'🌭','smoked meat':'🥩','terrine':'🥫','boudin':'🍖',
  'bœuf':'🥩','boeuf':'🥩','steak':'🥩','filet':'🥩','rôti':'🥩','bavette':'🥩','onglet':'🥩','tournedos':'🥩',
  'poulet':'🍗','poitrine':'🍗','cuisse':'🍗','pilon':'🍗','aile':'🍗','suprême':'🍗','foie':'🍖',
  'porc':'🥓','côtelette':'🥩','épaule':'🥩','agneau':'🍖','gigot':'🍖',
  'veau':'🥩','canard':'🦆','magret':'🦆','lapin':'🍖','bison':'🥩','tartare':'🥩','boulette':'🍖',
  'saumon':'🐟','truite':'🐟','tilapia':'🐟','morue':'🐟','aiglefin':'🐟','sole':'🐟','flétan':'🐟',
  'thon':'🐟','maquereau':'🐟','hareng':'🐟','doré':'🐟','bar':'🐟','plie':'🐟','vivaneau':'🐟','espadon':'🐟',
  'crevette':'🦐','homard':'🦞','crabe':'🦀','moule':'🦪','palourde':'🦪','pétoncle':'🦪','huître':'🦪',
  'calmar':'🦑','pieuvre':'🐙','poisson':'🐟','goberge':'🐟','caviar':'🐟',
  'pizza':'🍕','crème glacée':'🍦','glace':'🍦','sorbet':'🍧','popsicle':'🍡','yogourt glacé':'🍨',
  'frites':'🍟','rondelle':'🧅','pierogi':'🥟','egg roll':'🥢','dumpling':'🥟','burrito':'🌯',
  'gaufre':'🧇','crêpe':'🥞','pépite':'🍗','légumes surgelés':'🥦','fruits surgelés':'🫐',
  'lait':'🥛','crème':'🥛','babeurre':'🥛','yogourt':'🍶','kéfir':'🥛','fromage':'🧀','cheddar':'🧀',
  'mozzarella':'🧀','suisse':'🧀','feta':'🧀','cottage':'🧀','chèvre':'🧀','brie':'🧀','parmesan':'🧀',
  'gouda':'🧀','bocconcini':'🧀','beurre':'🧈','margarine':'🧈','œuf':'🥚','oeuf':'🥚',
  'pâtes':'🍝','spaghetti':'🍝','linguine':'🍝','penne':'🍝','rotini':'🍝','fettucine':'🍝','nouilles':'🍜',
  'ramen':'🍜','udon':'🍜','riz':'🍚','quinoa':'🌾','couscous':'🌾','orge':'🌾','boulgour':'🌾','polenta':'🌽',
  'sauce':'🥫','salsa':'🍅','tofu':'🍥','lentille':'🫘','pois chiche':'🫛','fève':'🫘',
  'houmous':'🥣','tahini':'🥣','huile':'🫗','vinaigre':'🫗','conserve':'🥫','sardine':'🐟','anchois':'🐟',
  'sel':'🧂','poivre':'🧂','paprika':'🌶️','cumin':'🧂','cannelle':'🧂','origan':'🌿','épice':'🧂','curcuma':'🧂',
  'cari':'🍛','curry':'🍛','farine':'🌾','sucre':'🧁','cassonade':'🧁','levure':'🌾','bicarbonate':'🧁',
  'vanille':'🌼','glaçage':'🧁','mélange à gâteau':'🎂','bouillon':'🍲',
  'craquelin':'🍘','galette':'🍘','café':'☕','thé':'🍵','tisane':'🍵',
  'barre':'🍫','céréale':'🥣','flocons':'🥣','gruau':'🥣','sirop':'🍯','érable':'🍁',
  'arachide':'🥜','amande':'🌰','tartinade':'🍫','confiture':'🍓','marmelade':'🍊',
  'miel':'🍯','chocolat':'🍫','bonbon':'🍬','réglisse':'🍬','gomme':'🍬',
  'compote':'🍎','pouding':'🍮','croustille':'🥔','chips':'🥔','maïs soufflé':'🍿','popcorn':'🍿','noix':'🌰',
  'cajou':'🥜','pistache':'🥜','pacane':'🌰','noisette':'🌰','bretzel':'🥨','raisin sec':'🍇',
  'jus':'🧃','limonade':'🍋','eau':'💧','cola':'🥤','soda':'🥤','racinette':'🥤','boisson gazeuse':'🥤',
  'thé glacé':'🧋','boisson énergétique':'⚡','boisson sportive':'🥤','kombucha':'🍹','punch':'🍹','smoothie':'🥤',
  'couche':'🍼','lingette':'🧻','préparation':'🍼','purée':'🍼','nourrisson':'🍼','dentifrice':'🪥',
  'brosse à dents':'🪥','rince-bouche':'🪥','déodorant':'🧴','savon':'🧼','gel douche':'🧴',
  'shampoing':'🧴','revitalisant':'🧴','rasoir':'🪒','tampon':'🩹','serviette':'🩹',
  'nourriture chien':'🐕','nourriture chat':'🐈','litière':'🐈','gâterie':'🦴','os à mâcher':'🦴',
  'balai':'🧹','vadrouille':'🧹','sac':'🗑️','poubelle':'🗑️','recyclage':'♻️','détergent':'🧴','lessive':'🧺',
  'assouplissant':'🧺','détachant':'🧴','désodorisant':'💨','bougie':'🕯️','javel':'🧴','nettoyant':'🧴',
  'vaisselle':'🧼','papier hygiénique':'🧻','essuie-tout':'🧻','mouchoir':'🧻',
  'pellicule':'📦','aluminium':'📦','parchemin':'📦','ampoule':'💡','ketchup':'🍅','moutarde':'🌭',
  'mayonnaise':'🥚','relish':'🥒','vinaigrette':'🥗','marinade':'🍖','assiette':'🍽️','verre':'🥤','ustensile':'🍴',
  'algues':'🍃','nori':'🍃','lait évaporé':'🥫','lait condensé':'🥫'
};

const TILE_COLORS = {
  'fruits-legumes': ['#dcfce7','#16a34a'], 'boulangerie': ['#fef3c7','#d97706'],
  'pret-a-manger': ['#fed7aa','#ea580c'], 'fleurs': ['#fce7f3','#db2777'],
  'charcuterie': ['#fee2e2','#dc2626'], 'viandes': ['#fecaca','#b91c1c'],
  'poissonnerie': ['#e0f2fe','#0284c7'], 'surgeles': ['#cffafe','#0891b2'],
  'produits-laitiers': ['#dbeafe','#2563eb'], 'default': ['#fef3c7','#dc2626']
};

const findEmoji = (name) => {
  const n = (name || '').toLowerCase();
  let best = null;
  for (const k in EMOJI_MAP) {
    if (n.includes(k) && (!best || k.length > best.length)) best = k;
  }
  return best ? EMOJI_MAP[best] : '🛒';
};

// findPhoto retourne maintenant une vignette {emoji, color} au lieu d'une URL
const findPhoto = (name, category) => {
  const emoji = findEmoji(name);
  let colorKey = 'default';
  const c = (category || '').toLowerCase();
  for (const z in TILE_COLORS) { if (z !== 'default' && (c.includes(z.replace(/-/g, ' ')) || c.includes(z))) { colorKey = z; break; } }

  // Vraie photo : d'abord un ID Unsplash connu, sinon photo par mot-clé
  const n = (name || '').toLowerCase();
  let url = null;
  for (const k in PHOTOS) { if (n === k) { url = PHOTOS[k]; break; } }
  if (!url) for (const k in PHOTOS) { if (n.includes(k)) { url = PHOTOS[k]; break; } }
  if (!url && category) { const cc = category.toLowerCase(); for (const k in PHOTOS) { if (cc.includes(k)) { url = PHOTOS[k]; break; } } }
  if (!url) {
    // Photo par mot-clé (fiable, sans ID spécifique) via Unsplash Source
    let best = null;
    for (const fr in KEYWORD_EN) { if (n.includes(fr) && (!best || fr.length > best.length)) best = fr; }
    const term = best ? KEYWORD_EN[best] : 'grocery,food';
    url = `https://source.unsplash.com/300x300/?${term}`;
  }

  return { url, emoji, color: TILE_COLORS[colorKey] };
};

const CATEGORY_TO_LOCATION = [
  { keywords: ['fruit', 'vegetable', 'légume', 'salad'], aisle: 0, zone: 'fruits-legumes' },
  { keywords: ['bread', 'pain', 'baguette', 'bakery', 'pastry', 'croissant'], aisle: 0, zone: 'boulangerie' },
  { keywords: ['sushi', 'sandwich', 'ready-meal'], aisle: 0, zone: 'pret-a-manger' },
  { keywords: ['ham', 'jambon', 'charcuterie', 'salami', 'bacon'], aisle: 0, zone: 'charcuterie' },
  { keywords: ['beef', 'chicken', 'pork', 'meat', 'poulet', 'viande'], aisle: 0, zone: 'viandes' },
  { keywords: ['salmon', 'fish-fresh', 'shrimp', 'seafood'], aisle: 0, zone: 'poissonnerie' },
  { keywords: ['frozen', 'surgelé', 'ice-cream'], aisle: 0, zone: 'surgeles' },
  { keywords: ['milk', 'lait', 'yogurt', 'yogourt', 'cheese', 'fromage', 'butter', 'dairy'], aisle: 0, zone: 'produits-laitiers' },
  { keywords: ['diaper', 'couche', 'baby'], aisle: 3, side: 'left' },
  { keywords: ['toothpaste', 'shampoo', 'deodorant'], aisle: 3, side: 'right' },
  { keywords: ['dog-food', 'cat-food', 'pet-food'], aisle: 4, side: 'left' },
  { keywords: ['laundry', 'detergent', 'cleaning'], aisle: 4, side: 'right' },
  { keywords: ['toilet-paper', 'paper-towel'], aisle: 5, side: 'left' },
  { keywords: ['ketchup', 'mustard', 'mayonnaise', 'condiment'], aisle: 5, side: 'right' },
  { keywords: ['rice', 'riz', 'noodle', 'ramen', 'asian', 'tofu'], aisle: 6, side: 'left' },
  { keywords: ['legume', 'lentil', 'chickpea', 'bean', 'mexican', 'tortilla'], aisle: 6, side: 'right' },
  { keywords: ['oil', 'huile', 'canned'], aisle: 7, side: 'left' },
  { keywords: ['pasta', 'pâtes', 'sauce', 'spice', 'épice'], aisle: 7, side: 'right' },
  { keywords: ['soup', 'soupe', 'cracker'], aisle: 8, side: 'left' },
  { keywords: ['flour', 'farine', 'sugar', 'sucre', 'baking'], aisle: 8, side: 'right' },
  { keywords: ['coffee', 'café', 'tea', 'thé'], aisle: 9, side: 'left' },
  { keywords: ['cereal', 'oatmeal', 'syrup', 'jam', 'peanut-butter'], aisle: 9, side: 'right' },
  { keywords: ['candy', 'chocolate', 'biscuit', 'cookie', 'compote'], aisle: 10, side: 'left' },
  { keywords: ['chip', 'crisp', 'popcorn', 'nut'], aisle: 10, side: 'right' },
  { keywords: ['juice', 'jus', 'water', 'eau'], aisle: 11, side: 'left' },
  { keywords: ['soda', 'cola', 'energy-drink', 'sports-drink'], aisle: 11, side: 'right' }
];

const locateProduct = (off) => {
  const c = (off.categories_tags || []).join(' ').toLowerCase() + ' ' + (off.categories || '').toLowerCase() + ' ' + (off.product_name || '').toLowerCase();
  for (const m of CATEGORY_TO_LOCATION) {
    if (m.keywords.some(k => c.includes(k))) return { aisle: m.aisle, side: m.side, zone: m.zone };
  }
  return null;
};

// Génère un prix pseudo-aléatoire mais stable (basé sur le nom) + promo occasionnelle
const priceFor = (name, category) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 100000;
  const cat = (category || '').toLowerCase();
  let base;
  if (cat.includes('viande') || cat.includes('poisson')) base = 8 + (h % 1800) / 100;       // 8-26$
  else if (cat.includes('fromage') || cat.includes('charcuterie')) base = 4 + (h % 1200) / 100; // 4-16$
  else if (cat.includes('fleurs')) base = 6 + (h % 2500) / 100;                                 // 6-31$
  else if (cat.includes('surgelé')) base = 3 + (h % 900) / 100;                                 // 3-12$
  else if (cat.includes('fruits') || cat.includes('boulangerie') || cat.includes('laitiers')) base = 1.5 + (h % 600) / 100; // 1.5-7.5$
  else base = 1 + (h % 1500) / 100;                                                             // 1-16$
  const price = Math.round(base * 100) / 100;
  // ~22% des produits en promo
  const onSale = (h % 100) < 22;
  let salePrice = null;
  if (onSale) {
    const pct = 10 + (h % 4) * 5; // 10,15,20,25%
    salePrice = Math.round(price * (1 - pct / 100) * 100) / 100;
    return { price, salePrice, discount: pct };
  }
  return { price, salePrice: null, discount: 0 };
};

const buildProducts = () => {
  const items = []; let id = 1;
  const add = (name, aisle, sw, category, k = []) => {
    const pricing = priceFor(name, category);
    const product = { id: id++, name, category, image: findPhoto(name, category), keywords: [name.toLowerCase(), ...k], ...pricing };
    if (aisle === 0) { product.aisle = 0; product.zone = sw; } else { product.aisle = aisle; product.side = sw; }
    items.push(product);
  };
  const fl = (n, k = []) => add(n, 0, 'fruits-legumes', 'Fruits et légumes', k);
  ['Pommes Gala','Pommes Granny Smith','Pommes Macintosh','Pommes Honeycrisp','Pommes Cortland','Bananes','Bananes biologiques','Oranges navel','Oranges sanguines','Clémentines','Mandarines','Citrons','Limes','Pamplemousses roses','Raisins verts sans pépins','Raisins rouges sans pépins','Raisins noirs','Fraises 1lb','Bleuets','Framboises','Mûres','Canneberges fraîches','Ananas','Mangue','Papaye','Kiwi','Avocats Hass','Melon d\'eau','Cantaloup','Melon miel','Poires Bartlett','Poires Anjou','Pêches','Nectarines','Prunes','Cerises','Dattes Medjool','Figues fraîches','Grenade','Tomates en grappe','Tomates cerises','Tomates italiennes','Tomates Roma','Concombres anglais','Concombres libanais','Poivrons rouges','Poivrons verts','Poivrons jaunes','Poivrons oranges','Carottes','Mini-carottes','Céleri','Brocoli','Chou-fleur','Chou vert','Chou rouge','Chou de Bruxelles','Laitue Iceberg','Laitue romaine','Laitue Boston','Épinards','Roquette','Salade mélangée','Kale','Oignons jaunes','Oignons rouges','Oignons verts','Échalotes françaises','Ail','Gingembre','Pommes de terre Yukon','Pommes de terre rouges','Pommes de terre russet','Patates douces','Champignons blancs','Champignons cremini','Champignons portobello','Maïs en épi','Courgettes','Courge spaghetti','Aubergine','Courge butternut','Asperges','Haricots verts','Petits pois frais','Radis','Betteraves','Navets','Persil frais','Coriandre fraîche','Basilic frais','Menthe fraîche','Romarin frais','Thym frais','Aneth frais','Citrouilles','Courge poivrée','Courge musquée','Panais','Rutabaga','Topinambour','Fenouil','Endives','Bok choy','Chou napa','Chou frisé','Pousses de pois','Germes de soya','Cresson','Bette à carde','Rapini','Artichauts','Poireau','Échalote grise','Piments forts','Piments jalapeño','Citrons verts','Pommes Ambrosia','Pommes Spartan','Pommes Empire','Poires asiatiques','Kaki','Litchi','Fruit du dragon','Carambole','Goyave','Physalis','Groseilles','Rhubarbe','Tomatilles','Choux-raves','Salsifis','Patate bleue','Mini-concombres','Tomates ancestrales','Tomates jaunes','Champignons shiitake','Champignons enoki','Champignons pleurotes'].forEach(n => fl(n));

  const bo = (n) => add(n, 0, 'boulangerie', 'Boulangerie');
  ['Pain blanc tranché','Pain brun tranché','Pain de blé entier','Pain multigrain','Pain au levain','Pain ciabatta','Baguette française','Baguette parisienne','Baguette aux olives','Croissants au beurre','Croissants au chocolat','Chocolatines','Brioches','Bagels nature','Bagels sésame','Bagels tout garni','Muffins anglais','Muffins bleuets','Muffins son','Tartelettes aux fruits','Tartes aux pommes','Gâteaux décorés','Beignes glacés','Beignes au chocolat','Beignes Boston','Pain pita','Naan','Tortillas de blé','Pâte feuilletée','Pâte à pizza','Pain aux raisins','Pain aux noix','Pain de seigle','Pain hot-dog','Pain hamburger','Pain kaiser','Focaccia','Fougasse','Pain naan à l\'ail','Scones','Danoises aux fruits','Strudel aux pommes','Éclairs','Mille-feuilles','Gâteau au fromage','Gâteau forêt-noire','Biscottes','Pain doré tranché','Croûtons maison','Chapelure fraîche','Petits pains au lait','Pain aux bananes','Madeleines','Palmiers','Galettes bretonnes'].forEach(bo);

  const pa = (n) => add(n, 0, 'pret-a-manger', 'Prêt-à-manger');
  ['Sushi assortis','Sushi maki saumon','Sushi maki thon','Sandwichs au poulet','Sandwichs au jambon','Sandwichs au thon','Wraps au poulet','Wraps césar','Wraps végétariens','Salades césar préparées','Salades grecques','Bols poke','Poulet rôti chaud','Côtes levées BBQ','Macaroni au fromage','Soupe du jour','Quiches lorraines','Plateaux de fromages','Sandwichs club','Paninis grillés','Salades de pâtes','Salades de quinoa','Bols burrito','Pâtés au poulet','Pizzas fraîches','Lasagnes maison','Pâté chinois','Rouleaux de printemps','Samoussas','Ailes de poulet BBQ','Brochettes de poulet','Salade de chou','Houmous et crudités','Plateaux de sushis','Bols ramen frais'].forEach(pa);

  const fls = (n) => add(n, 0, 'fleurs', 'Fleurs et saisonnier');
  ['Bouquet mixte','Roses rouges','Roses blanches','Tulipes','Tournesols','Lys','Plantes en pot','Orchidées','Marguerites','Pivoines','Hortensias','Lavande en pot','Succulentes','Bonsaï','Cartes de souhaits','Ballons d\'occasion','Chrysanthèmes','Gerberas'].forEach(fls);

  const ch = (n) => add(n, 0, 'charcuterie', 'Charcuterie');
  ['Jambon cuit tranché','Jambon fumé','Prosciutto','Dinde fumée tranchée','Salami italien','Salami Gênes','Pepperoni','Saucisson sec','Mortadelle','Bacon tranché','Bacon double-fumé','Saucisses italiennes','Saucisses bratwurst','Saucisses merguez','Saucisses chorizo','Cretons','Pâté de foie','Rillettes','Terrine de campagne','Chorizo espagnol','Saucisson de Gênes','Capicollo','Coppa','Bresaola','Saucisses fumées','Tofu fumé tranché','Jambon de Parme','Pancetta','Boudin','Saucisses cocktail','Galantine','Cretons de porc maison','Smoked meat tranché'].forEach(ch);

  const vi = (n) => add(n, 0, 'viandes', 'Viandes');
  ['Bœuf haché extra-maigre','Bœuf haché mi-maigre','Bœuf haché régulier','Steak de surlonge','Steak de faux-filet','Filet mignon','Bavette de bœuf','Rôti de bœuf','Cubes de bœuf à ragoût','Poulet entier','Poitrines de poulet','Cuisses de poulet','Pilons de poulet','Ailes de poulet','Hauts de cuisse de poulet','Côtelettes de porc','Filet de porc','Rôti de porc','Côtes levées de porc','Épaule de porc','Agneau haché','Côtelettes d\'agneau','Gigot d\'agneau','Veau haché','Escalope de veau','Saucisses de veau','Foie de veau','Tournedos','Côte de bœuf','Onglet de bœuf','Jarret de bœuf','Queue de bœuf','Poulet de Cornouailles','Suprêmes de poulet','Foies de poulet','Dinde entière','Poitrine de dinde','Cuisses de canard','Magret de canard','Saucisses de porc','Jambon frais','Côtelettes de veau','Tartare de bœuf préparé','Brochettes de bœuf','Boulettes de viande','Saucisses à déjeuner','Lapin','Bison haché'].forEach(vi);

  const po = (n) => add(n, 0, 'poissonnerie', 'Poissonnerie');
  ['Saumon de l\'Atlantique','Saumon sauvage du Pacifique','Filet de saumon','Truite arc-en-ciel','Tilapia','Morue fraîche','Aiglefin','Sole','Flétan','Thon frais','Crevettes fraîches','Crevettes tigrées','Pétoncles','Moules','Palourdes','Homards vivants','Crabe des neiges','Pinces de crabe','Calmars','Pieuvre','Bar rayé','Doré','Truite mouchetée','Maquereau','Hareng fumé','Saumon fumé','Caviar','Tartare de saumon','Filet de tilapia','Crevettes nordiques','Chair de crabe','Goberge','Plie','Espadon','Vivaneau'].forEach(po);

  const su = (n) => add(n, 0, 'surgeles', 'Surgelés');
  ['Pizza surgelée pepperoni','Pizza surgelée 3 fromages','Pizza surgelée végétarienne','Pizza surgelée Hawaïenne','Crème glacée vanille','Crème glacée chocolat','Crème glacée napolitaine','Sorbets aux fruits','Popsicles','Yogourt glacé','Légumes mélangés surgelés','Brocoli surgelé','Maïs en grains surgelé','Petits pois surgelés','Épinards surgelés','Fruits mélangés surgelés','Bleuets surgelés','Fraises surgelées','Frites surgelées','Pelures de pommes de terre','Pierogis','Egg rolls','Dumplings','Lasagne surgelée','Poisson pané surgelé','Pépites de poulet','Burritos surgelés','Gaufres surgelées','Crêpes surgelées','Pommes de terre rissolées','Rondelles d\'oignon','Bâtonnets de fromage','Pizza pochette','Repas congelés santé','Bols déjeuner surgelés','Tartes surgelées','Croissants à cuire','Pain à l\'ail surgelé','Légumes pour sauté','Edamames surgelés','Mangues surgelées','Açai surgelé','Smoothies surgelés','Sorbet mangue','Crème glacée café','Sandwichs glacés','Barres glacées chocolat'].forEach(su);

  const pl = (n) => add(n, 0, 'produits-laitiers', 'Produits laitiers');
  ['Lait écrémé 2L','Lait 1% 2L','Lait 2% 2L','Lait 3.25% 2L','Lait 2% 4L','Lait au chocolat','Crème 35% à fouetter','Crème 15% à café','Crème 10%','Crème sure','Yogourt grec nature','Yogourt grec aux fruits','Yogourt aux fruits','Kéfir','Fromage cheddar mi-fort','Fromage cheddar fort','Fromage cheddar marbré','Fromage mozzarella','Fromage suisse','Fromage feta','Fromage cottage','Fromage à la crème','Fromage de chèvre','Beurre salé','Beurre non salé','Margarine','Œufs gros (douzaine)','Œufs extra-gros','Œufs biologiques','Œufs oméga-3','Blancs d\'œufs liquides','Lait sans lactose','Lait de chèvre','Yogourt à boire','Yogourt végétal','Tofu soyeux dessert','Fromage Oka','Fromage brie','Fromage camembert','Fromage gouda','Fromage parmesan','Fromage bocconcini','Fromage en grains','Fromage halloumi','Fromage ricotta','Fromage mascarpone','Crème fouettée en aérosol','Trempette aux légumes','Pouding au lait','Lait de poule'].forEach(pl);

  // Allée 1
  ['Lait d\'amande nature','Lait d\'amande vanille','Lait d\'avoine','Lait de coco en carton','Lait de riz','Pain sans gluten','Pâtes sans gluten','Crackers sans gluten','Yogourt biologique','Fromage biologique','Pizza végétalienne surgelée','Bols repas surgelés'].forEach(n => add(n, 1, 'left', 'Naturels'));
  ['Granola biologique','Céréales muesli','Café équitable','Café biologique moulu','Boisson de soya nature','Boisson de soya vanille','Jus pressé à froid','Kombucha','Jus de canneberge biologique'].forEach(n => add(n, 1, 'right', 'Naturels'));

  // Allée 2
  ['Pâtes biologiques penne','Pâtes biologiques spaghetti','Pâtes de quinoa','Pâtes de lentilles','Pâtes de pois chiches','Sauce tomate biologique','Sauce arrabbiata bio','Soupe aux lentilles bio','Soupe minestrone bio','Huile de coco bio','Sirop d\'agave'].forEach(n => add(n, 2, 'left', 'Naturels'));
  ['Croustilles biologiques','Croustilles de légumes','Barres aux noix biologiques','Barres énergétiques','Biscuits biologiques','Chocolat noir 70%','Chocolat équitable'].forEach(n => add(n, 2, 'right', 'Naturels'));

  // Allée 3
  ['Couches taille 1','Couches taille 2','Couches taille 3','Couches taille 4','Couches taille 5','Couches de nuit','Couches biologiques','Lingettes humides parfumées','Lingettes non parfumées','Crème pour érythème fessier','Shampoing pour bébé','Lotion pour bébé','Préparation nourrisson étape 1','Préparation nourrisson étape 2','Préparation hypoallergénique','Pots de purée pommes','Pots de purée légumes','Pots de purée viande','Céréales pour bébé','Biscuits pour bébé'].forEach(n => add(n, 3, 'left', 'Bébé'));
  ['Dentifrice menthe fraîche','Dentifrice blanchissant','Dentifrice sensibilité','Dentifrice pour enfants','Brosse à dents manuelle','Brosse à dents électrique','Soie dentaire','Rince-bouche menthe','Déodorant en bâton','Déodorant en vaporisateur','Antisudorifique','Savon de douche','Gel douche','Rasoirs jetables','Crème à raser','Tampons réguliers','Tampons super','Serviettes hygiéniques','Coupe menstruelle','Shampoing antipelliculaire','Shampoing hydratant','Revitalisant hydratant','Masque capillaire'].forEach(n => add(n, 3, 'right', 'Soins personnels'));

  // Allée 4
  ['Nourriture sèche chien adulte','Nourriture sèche chien senior','Nourriture humide chien','Gâteries pour chiens','Os à mâcher','Nourriture sèche chat adulte','Nourriture sèche chat senior','Nourriture humide chat','Litière agglomérante','Gâteries pour chats','Balai-brosse','Vadrouille en microfibre','Sacs poubelle 30L','Sacs poubelle 60L','Sacs de recyclage bleus'].forEach(n => add(n, 4, 'left', 'Animaux et ménage'));
  ['Détergent liquide à lessive','Détergent en capsules','Détergent en poudre','Assouplissant','Feuilles assouplissantes','Détachant','Désodorisant en aérosol','Diffuseur de parfum','Bougies parfumées','Eau de Javel','Nettoyant multi-surfaces','Nettoyant pour vitres','Nettoyant salle de bain','Savon à vaisselle liquide','Tablettes lave-vaisselle'].forEach(n => add(n, 4, 'right', 'Entretien'));

  // Allée 5
  ['Papier hygiénique 12 rouleaux','Papier hygiénique 24 rouleaux','Papier hygiénique double épaisseur','Essuie-tout 6 rouleaux','Essuie-tout select-a-size','Mouchoirs en boîte','Sacs à sandwich','Sacs à congélation','Pellicule plastique','Papier d\'aluminium','Papier parchemin','Ampoules LED 60W','Ampoules LED 100W','Ampoules halogènes'].forEach(n => add(n, 5, 'left', 'Maison'));
  ['Vinaigrette césar','Vinaigrette italienne','Vinaigrette balsamique','Vinaigrette ranch','Ketchup régulier','Ketchup sans sucre ajouté','Moutarde jaune','Moutarde de Dijon','Moutarde forte','Mayonnaise régulière','Mayonnaise allégée','Relish','Sauce piquante','Sauce tabasco','Marinade BBQ','Marinade teriyaki','Assiettes en carton','Verres en plastique','Ustensiles jetables'].forEach(n => add(n, 5, 'right', 'Condiments'));

  // Allée 6
  ['Riz basmati 1kg','Riz basmati 5kg','Riz jasmin','Riz brun','Riz arborio','Riz sauvage','Riz mélangé','Nouilles ramen instantanées','Nouilles udon','Nouilles soba','Nouilles de riz','Vermicelles de riz','Sauce soya régulière','Sauce soya légère','Sauce hoisin','Sauce huître','Tofu ferme','Tofu soyeux','Algues nori','Vinaigre de riz','Lait de coco en conserve'].forEach(n => add(n, 6, 'left', 'International'));
  ['Lentilles vertes sèches','Lentilles rouges','Pois chiches en conserve','Pois chiches secs','Haricots noirs','Haricots rouges','Haricots blancs','Fèves de soya','Tortillas de maïs','Coquilles à taco','Salsa douce','Salsa moyenne','Salsa piquante','Houmous traditionnel','Tahini','Pâte de cari rouge','Pâte de cari vert','Lait de coco bio','Sauce sriracha','Sauce poisson','Pâte miso','Wasabi','Gingembre mariné','Châtaignes d\'eau','Pousses de bambou','Sauce teriyaki','Nouilles chow mein','Galettes de riz vietnamiennes','Curry en poudre','Garam masala','Couscous israélien','Boulgour fin','Polenta','Semoule de blé'].forEach(n => add(n, 6, 'right', 'International'));

  // Allée 7
  ['Huile d\'olive extra-vierge 500ml','Huile d\'olive extra-vierge 1L','Huile de canola','Huile végétale','Huile de tournesol','Huile de sésame','Huile d\'arachide','Couscous','Quinoa blanc','Quinoa rouge','Orge perlé','Boulgour','Maïs en conserve','Petits pois en conserve','Haricots verts en conserve','Tomates en dés','Tomates broyées','Pâte de tomates','Thon en conserve à l\'eau','Thon en conserve à l\'huile','Saumon en conserve','Sardines à l\'huile','Anchois'].forEach(n => add(n, 7, 'left', 'Garde-manger'));
  ['Spaghetti','Linguine','Penne','Rotini','Macaroni','Lasagne (pâtes)','Fettucine','Farfalle','Sauce à spaghetti','Sauce arrabbiata','Sauce alfredo','Sauce pesto','Sauce rosée','Sel de mer','Sel kosher','Poivre noir moulu','Poivre blanc','Paprika','Cumin','Cannelle moulue','Origan séché','Basilic séché','Curcuma','Coriandre moulue','Mélange italien','Penne de blé entier','Spaghettini','Cheveux d\'ange','Gnocchi','Coquilles','Macaroni au fromage en boîte','Vinaigre balsamique','Vinaigre de cidre','Vinaigre blanc','Sauce Worcestershire','Sauce soya tamari','Bouillon en cubes','Pesto rouge','Origan frais séché','Feuilles de laurier','Clous de girofle','Muscade','Gingembre moulu','Cari jaune','Piment de Cayenne','Graines de sésame','Graines de fenouil','Vanille en gousse'].forEach(n => add(n, 7, 'right', 'Pâtes et épices'));

  // Allée 8
  ['Soupe poulet et nouilles','Soupe aux légumes','Soupe tomate','Soupe minestrone','Soupe aux champignons crémeuse','Soupe au poulet et riz','Bouillon de poulet','Bouillon de bœuf','Bouillon de légumes','Biscuits soda','Craquelins ronds','Craquelins multigrains','Craquelins au fromage','Galettes de riz nature','Galettes de riz caramel','Galettes de riz chocolat'].forEach(n => add(n, 8, 'left', 'Soupes'));
  ['Mélange à gâteau au chocolat','Mélange à gâteau vanille','Mélange à muffins bleuets','Mélange à brownies','Glaçage à gâteau','Farine tout usage','Farine de blé entier','Farine à pain','Levure chimique','Bicarbonate de soude','Levure sèche active','Pépites de chocolat','Vanille extrait','Sucre blanc','Cassonade','Sucre en poudre','Sucre d\'érable'].forEach(n => add(n, 8, 'right', 'Pâtisserie'));

  // Allée 9
  ['Café moulu régulier','Café moulu corsé','Café moulu colombien','Café en grains','Café instantané','Café décaféiné','Capsules de café régulier','Capsules de café fort','Thé noir orange pekoe','Thé vert','Thé Earl Grey','Thé chai','Thé blanc','Tisane camomille','Tisane menthe','Tisane fruits rouges','Tisane détente','Lait évaporé','Lait condensé sucré','Barres granola tendres','Barres granola croquantes','Barres protéinées chocolat','Barres protéinées vanille'].forEach(n => add(n, 9, 'left', 'Café et thé'));
  ['Céréales chocolatées','Céréales miel','Céréales aux fruits','Céréales de blé soufflé','Céréales son','Céréales corn flakes','Flocons d\'avoine','Gruau instantané','Crème de blé','Sirop d\'érable 250ml','Sirop d\'érable 500ml','Sirop d\'érable 1L','Sirop de table','Beurre d\'arachide crémeux','Beurre d\'arachide croquant','Beurre d\'amande','Tartinade chocolat-noisette','Confiture aux fraises','Confiture aux framboises','Confiture aux bleuets','Marmelade d\'orange','Miel liquide','Miel crémeux','Céréales granola','Céréales avoine et miel','Céréales multigrains','Muesli suisse','Son d\'avoine','Graines de chia','Graines de lin','Beurre de noix de cajou','Tartinade de spéculoos','Sirop de maïs','Mélasse','Confiture d\'abricots','Gelée de pommes','Tartinade aux fraises sans sucre','Granola en sachets','Barres déjeuner','Compote à boire'].forEach(n => add(n, 9, 'right', 'Déjeuner'));

  // Allée 10
  ['Tablette chocolat au lait','Tablette chocolat noir','Tablette chocolat blanc','Bonbons assortis','Bonbons gélifiés','Réglisse rouge','Réglisse noire','Gomme à mâcher menthe','Gomme à mâcher fruits','Menthes','Biscuits au chocolat','Biscuits aux brisures','Biscuits à l\'avoine','Biscuits sandwich vanille','Biscuits Graham','Biscuits secs petit déjeuner','Compote de pommes nature','Compote pommes-fraises','Compote pommes-poires','Compote en sachet enfants','Pouding au chocolat','Pouding à la vanille','Pouding au caramel'].forEach(n => add(n, 10, 'left', 'Confiserie'));
  ['Croustilles régulières','Croustilles BBQ','Croustilles sel et vinaigre','Croustilles ketchup','Croustilles crème sure','Croustilles tortilla','Croustilles nacho fromage','Maïs soufflé au beurre','Maïs soufflé au caramel','Maïs soufflé pour micro-ondes','Amandes salées','Amandes nature','Cajous salés','Arachides salées','Pistaches','Mélange de noix','Pacanes','Noisettes','Croustilles cuites au four','Croustilles de maïs','Bretzels','Craquelins de riz','Mélange montagnard','Fruits séchés','Canneberges séchées','Raisins secs','Abricots séchés','Graines de tournesol','Graines de citrouille','Noix de Grenoble','Noix du Brésil','Noix de macadam','Barres de fruits','Croustilles de chou frisé','Pois croquants','Edamames grillés'].forEach(n => add(n, 10, 'right', 'Grignotines'));

  // Allée 11
  ['Jus de tomate','Jus de légumes mélangé','Jus de carotte','Jus d\'orange 1.5L','Jus de pomme 1L','Jus de raisin','Jus multi-fruits','Cocktail de canneberge','Limonade','Jus en boîte (pomme)','Jus en boîte (orange)','Jus en boîte (raisin)','Boisson aux fruits en boîte','Eau de source 24x500ml','Eau de source 4L','Eau pétillante nature','Eau pétillante citron','Eau aromatisée'].forEach(n => add(n, 11, 'left', 'Jus et eau'));
  ['Cola 2L','Cola diète 2L','Boisson gazeuse orange','Boisson gazeuse citron-lime','Soda gingembre','Racinette','Thé glacé citron','Thé glacé pêche','Boisson énergétique régulière','Boisson énergétique sans sucre','Boisson énergétique aux fruits','Boisson sportive bleue','Boisson sportive orange','Boisson sportive citron','Eau de coco','Boisson gazeuse cola cerise','Soda mousse','Tonic','Soda club','Eau tonique','Boisson au gingembre','Kombucha en canette','Thé vert glacé','Café froid en bouteille','Boisson protéinée','Lait frappé en bouteille','Limonade rose','Punch aux fruits','Boisson gazeuse raisin'].forEach(n => add(n, 11, 'right', 'Boissons'));

  // ============================================================
  // GÉNÉRATEUR DE VARIANTES — étend le catalogue de façon réaliste
  // (marques génériques + formats), sans tout taper à la main
  // ============================================================
  const BRANDS = ['Sans Nom', 'Choix du Président', 'Compliments', 'Sélection', 'Irresistibles', 'Great Value', 'Kirkland'];
  const baseCount = items.length;
  // On cible ~1500 produits au total : on ajoute des variantes de marque
  // aux produits emballés (allées 3 à 11), pas aux produits frais du périmètre.
  const packaged = items.filter(p => p.aisle >= 3 && p.aisle <= 11);
  let bi = 0;
  const targetTotal = 1500;
  outer:
  for (let round = 0; round < 3; round++) {
    for (const base of packaged) {
      if (items.length >= targetTotal) break outer;
      // une variante de marque différente à chaque tour
      const brand = BRANDS[bi % BRANDS.length]; bi++;
      // évite les doublons exacts
      const variantName = `${base.name} — ${brand}`;
      if (items.some(p => p.name === variantName)) continue;
      const pricing = priceFor(variantName, base.category);
      items.push({
        id: id++, name: variantName, category: base.category, brand,
        image: findPhoto(base.name, base.category),
        keywords: [base.name.toLowerCase(), brand.toLowerCase()],
        aisle: base.aisle, side: base.side, ...pricing
      });
    }
  }

  return items;
};

const INITIAL_PRODUCTS = buildProducts();

// ============================================================
// RECETTES — suggestions selon les ingrédients du panier
// ============================================================
const RECIPES = [
  { id: 'r1', name: 'Spaghetti bolognaise', emoji: '🍝', time: '30 min', image: PHOTOS['spaghetti'],
    ingredients: ['spaghetti', 'bœuf haché', 'sauce tomate', 'oignon', 'ail', 'parmesan'] },
  { id: 'r2', name: 'Saumon teriyaki et riz', emoji: '🍣', time: '25 min', image: PHOTOS['saumon'],
    ingredients: ['saumon', 'riz', 'sauce soya', 'gingembre', 'oignon vert', 'sésame'] },
  { id: 'r3', name: 'Salade César au poulet', emoji: '🥗', time: '20 min', image: PHOTOS['salade'],
    ingredients: ['laitue romaine', 'poulet', 'parmesan', 'vinaigrette césar', 'pain', 'bacon'] },
  { id: 'r4', name: 'Tacos au bœuf', emoji: '🌮', time: '25 min', image: PHOTOS['tortilla'],
    ingredients: ['bœuf haché', 'tortilla', 'salsa', 'cheddar', 'laitue', 'tomate'] },
  { id: 'r5', name: 'Déjeuner œufs-bacon', emoji: '🍳', time: '15 min', image: PHOTOS['œuf'],
    ingredients: ['œuf', 'bacon', 'pain', 'beurre', 'café'] },
  { id: 'r6', name: 'Poulet rôti et légumes', emoji: '🍗', time: '60 min', image: PHOTOS['poulet'],
    ingredients: ['poulet', 'pomme de terre', 'carotte', 'oignon', 'ail', 'huile'] },
  { id: 'r7', name: 'Smoothie aux fruits', emoji: '🥤', time: '5 min', image: PHOTOS['fraise'],
    ingredients: ['banane', 'fraise', 'bleuet', 'yogourt', 'lait'] },
  { id: 'r8', name: 'Pâtes Alfredo', emoji: '🍝', time: '20 min', image: PHOTOS['penne'],
    ingredients: ['penne', 'crème', 'parmesan', 'ail', 'beurre', 'poulet'] },
  { id: 'r9', name: 'Soupe aux légumes', emoji: '🍲', time: '40 min', image: PHOTOS['soupe'],
    ingredients: ['carotte', 'céleri', 'oignon', 'pomme de terre', 'bouillon', 'tomate'] },
  { id: 'r10', name: 'Sauté de tofu', emoji: '🥢', time: '20 min', image: PHOTOS['tofu'],
    ingredients: ['tofu', 'riz', 'brocoli', 'sauce soya', 'gingembre', 'poivron'] },
  { id: 'r11', name: 'Pizza maison', emoji: '🍕', time: '35 min', image: PHOTOS['pizza surgelée'],
    ingredients: ['pâte à pizza', 'sauce tomate', 'mozzarella', 'pepperoni', 'champignon'] },
  { id: 'r12', name: 'Crêpes du matin', emoji: '🥞', time: '20 min', image: PHOTOS['muffin'],
    ingredients: ['farine', 'œuf', 'lait', 'beurre', 'sirop'] }
];

// Trouve les recettes pertinentes selon les produits du panier
const suggestRecipes = (cartProducts) => {
  if (!cartProducts.length) return [];
  const cartWords = cartProducts.flatMap(p => [p.name.toLowerCase(), ...(p.keywords || [])]);
  return RECIPES.map(recipe => {
    const matched = recipe.ingredients.filter(ing => cartWords.some(w => w.includes(ing) || ing.includes(w.split(' ')[0])));
    return { ...recipe, matchCount: matched.length, matchedIngredients: matched };
  }).filter(r => r.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount).slice(0, 4);
};

const searchOpenFoodFacts = async (q) => {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,product_name_fr,brands,categories,categories_tags,image_front_small_url,image_url,quantity`;
    const r = await fetch(url); const d = await r.json();
    return (d.products || []).map(p => ({
      id: `off-${p.code}`, name: p.product_name_fr || p.product_name || '', brand: p.brands || '',
      quantity: p.quantity || '', image: p.image_front_small_url || p.image_url || null,
      category: p.categories || '', ...locateProduct(p), source: 'off'
    })).filter(p => p.name);
  } catch (e) { return []; }
};

const fetchByBarcode = async (b) => {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${b}.json?fields=code,product_name,product_name_fr,brands,categories,categories_tags,image_front_small_url,image_url,quantity`;
    const r = await fetch(url); const d = await r.json();
    if (d.status !== 1) return null;
    const p = d.product;
    return { id: `off-${p.code}`, name: p.product_name_fr || p.product_name || '', brand: p.brands || '', quantity: p.quantity || '', image: p.image_front_small_url || p.image_url || null, category: p.categories || '', ...locateProduct(p), source: 'off' };
  } catch (e) { return null; }
};

// ============================================================
// THÈME clair/sombre
// ============================================================
const useTheme = () => {
  const [mode, setMode] = useState('light');
  const toggle = () => setMode(m => m === 'light' ? 'dark' : 'light');
  const isDark = mode === 'dark';
  const t = isDark ? {
    bgGradient: 'bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800',
    surface: 'bg-stone-800', surfaceAlt: 'bg-stone-800/60', surfaceHover: 'bg-stone-700',
    text: 'text-stone-100', textSecondary: 'text-stone-300', textMuted: 'text-stone-400',
    border: 'border-stone-700', borderStrong: 'border-stone-600',
    input: 'bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-red-400 focus:ring-red-900/40',
    headerBg: 'bg-stone-900/90', navBg: 'bg-stone-900/95',
    cardShadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.4)]', cardShadowHover: 'shadow-[0_6px_28px_rgba(0,0,0,0.5)]'
  } : {
    bgGradient: 'bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50',
    surface: 'bg-white', surfaceAlt: 'bg-amber-50/60', surfaceHover: 'bg-stone-50',
    text: 'text-stone-900', textSecondary: 'text-stone-600', textMuted: 'text-stone-500',
    border: 'border-stone-200', borderStrong: 'border-stone-300',
    input: 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-red-500 focus:ring-red-100',
    headerBg: 'bg-white/90', navBg: 'bg-white/95',
    cardShadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]', cardShadowHover: 'shadow-[0_6px_28px_rgba(0,0,0,0.1)]'
  };
  return { mode, toggle, t, isDark };
};

// ============================================================
// COMPOSANTS DE BASE
// ============================================================
const Logo = ({ isDark }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative">
      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-md">
        <ShoppingCart size={20} strokeWidth={2.5} />
      </div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
        <Heart size={9} className="text-red-600 fill-red-600" />
      </div>
    </div>
    <div className="leading-tight">
      <div className={`font-bold text-base ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Mon Magasin</div>
      <div className="font-hand text-sm text-red-600 -mt-0.5">trouvez tout, facilement</div>
    </div>
  </div>
);

const AisleBadge = ({ aisle, side, zone, small = false, isDark = false }) => {
  if (aisle === undefined || aisle === null) {
    return (
      <span className={`inline-flex items-center gap-1 ${isDark ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-600'} font-medium rounded-full ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
        <AlertCircle size={small ? 9 : 11} />Non assigné
      </span>
    );
  }
  if (aisle === 0 && zone) {
    const z = PERIMETER_ZONES[zone];
    if (!z) return null;
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}
        style={{ backgroundColor: isDark ? z.bgDark + '80' : z.bg, color: isDark ? '#fafafa' : z.color }}>
        <span>{z.emoji}</span>{z.name}
      </span>
    );
  }
  const isNatural = aisle <= 2;
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} ${
      isNatural ? (isDark ? 'bg-green-900/60 text-green-200' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900/40 text-red-200' : 'bg-red-100 text-red-700')
    }`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isNatural ? 'bg-green-600' : 'bg-red-600'}`}>{aisle}</span>
      Allée {aisle}{side && side !== 'perimeter' && <span className="opacity-70">· {side === 'left' ? 'G' : 'D'}</span>}
    </span>
  );
};

const ProductImage = ({ src, alt, size = 'md', isDark = false }) => {
  const [urlError, setUrlError] = useState(false);
  const sizes = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-24 h-24', xl: 'w-32 h-32' };
  const emojiSizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl', xl: 'text-6xl' };

  // Normalise : src peut être un objet {url, emoji, color}, une string URL, ou null
  const obj = (src && typeof src === 'object') ? src : null;
  const url = obj ? obj.url : (typeof src === 'string' ? src : null);
  const emoji = obj ? obj.emoji : null;
  const color = obj ? obj.color : null;

  // Etape 1 - vraie photo (visible hors sandbox)
  if (url && !urlError) {
    return (
      <div className={`${sizes[size]} rounded-xl shrink-0 ${isDark ? 'bg-stone-200' : 'bg-white'} border-2 ${isDark ? 'border-stone-600' : 'border-amber-100'} overflow-hidden`}>
        <img src={url} alt={alt} onError={() => setUrlError(true)} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  // Etape 2 - repli vignette emoji coloree, toujours visible
  if (emoji) {
    const [bg, accent] = color || ['#fef3c7', '#dc2626'];
    return (
      <div className={`${sizes[size]} rounded-xl flex items-center justify-center shrink-0 border-2 overflow-hidden`}
        style={{ background: isDark ? `linear-gradient(135deg, ${accent}22, ${accent}44)` : `linear-gradient(135deg, ${bg}, #ffffff)`, borderColor: isDark ? accent + '55' : accent + '33' }}>
        <span className={emojiSizes[size]} style={{ lineHeight: 1 }}>{emoji}</span>
      </div>
    );
  }

  // Etape 3 - dernier repli icone
  return (
    <div className={`${sizes[size]} ${isDark ? 'bg-stone-700' : 'bg-amber-100'} rounded-xl flex items-center justify-center shrink-0 border-2 ${isDark ? 'border-stone-600' : 'border-amber-200'}`}>
      <Package size={size === 'sm' ? 18 : size === 'lg' || size === 'xl' ? 32 : 24} className={isDark ? 'text-stone-500' : 'text-amber-400'} />
    </div>
  );
};

const Field = ({ label, hint, required, children, theme }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className={`text-xs font-bold ${theme.t.textSecondary} uppercase tracking-wide`}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <span className={`text-[10px] ${theme.t.textMuted}`}>{hint}</span>}
    </div>
    {children}
  </div>
);

const FilterPill = ({ active, onClick, children, color, theme }) => {
  const { isDark } = theme;
  const styles = active
    ? (color === 'green' ? 'bg-green-600 text-white shadow-md' : color === 'red' ? 'bg-red-600 text-white shadow-md' : 'bg-stone-900 text-white shadow-md')
    : (isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200');
  return <button onClick={onClick} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${styles}`}>{children}</button>;
};

const StatCard = ({ label, value, unit, emoji, accent, theme }) => {
  const { t } = theme;
  const colors = { green: 'text-green-600', yellow: 'text-yellow-600', red: 'text-red-600' };
  return (
    <div className={`${t.surface} border-2 ${t.border} rounded-2xl p-4 ${t.cardShadow}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`text-xs font-bold ${t.textMuted} uppercase tracking-wide`}>{label}</div>
        <span className="text-lg">{emoji}</span>
      </div>
      <div className={`text-3xl font-bold leading-none ${accent ? colors[accent] : t.text}`}>{value}</div>
      <div className={`text-[10px] ${t.textMuted} font-medium mt-1`}>{unit}</div>
    </div>
  );
};

// Étiquette de prix avec gestion des promos
const PriceTag = ({ product, theme, size = 'md' }) => {
  const { t } = theme;
  if (product.price === undefined || product.price === null) return null;
  const onSale = product.salePrice != null;
  const big = size === 'lg';
  return (
    <div className="flex items-center gap-1.5">
      {onSale ? (
        <>
          <span className={`font-bold ${big ? 'text-xl' : 'text-base'} text-red-600`}>{product.salePrice.toFixed(2)}$</span>
          <span className={`${big ? 'text-sm' : 'text-xs'} ${t.textMuted} line-through`}>{product.price.toFixed(2)}$</span>
        </>
      ) : (
        <span className={`font-bold ${big ? 'text-xl' : 'text-base'} ${t.text}`}>{product.price.toFixed(2)}$</span>
      )}
    </div>
  );
};

// Badge promo (coin rouge)
const PromoBadge = ({ product }) => {
  if (product.salePrice == null) return null;
  return (
    <span className="inline-flex items-center gap-0.5 bg-yellow-400 text-red-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
      ⚡ -{product.discount}%
    </span>
  );
};

// Bouton favori (cœur)
const FavoriteButton = ({ productId, favorites, onToggle, theme, size = 16 }) => {
  const { isDark } = theme;
  const isFav = favorites.includes(productId);
  return (
    <button onClick={(e) => { e.stopPropagation(); onToggle(productId); }} className={`p-2 rounded-lg transition-all ${isFav ? 'bg-red-100 text-red-600' : (isDark ? 'bg-stone-700 text-stone-400 hover:text-red-400' : 'bg-stone-100 text-stone-400 hover:text-red-500')}`} title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
      <Heart size={size} className={isFav ? 'fill-red-600' : ''} />
    </button>
  );
};

// ============================================================
// PLAN DU MAGASIN
// ============================================================
const StoreMap = ({ highlightAisle = null, highlightZone = null, shoppingPath = [], theme }) => {
  const { t, isDark } = theme;

  // Petite étiquette de section du périmètre (mur)
  const Wall = ({ zone, className = '', tall = false }) => {
    const z = PERIMETER_ZONES[zone];
    const active = highlightZone === zone;
    return (
      <div className={`relative rounded-xl flex items-center justify-center gap-1.5 px-2 transition-all duration-300 ${className} ${active ? 'scale-[1.03] z-10' : ''}`} style={{
        background: active ? `linear-gradient(135deg, ${z.color}, ${z.color}dd)` : (isDark ? `${z.bgDark}55` : `${z.bg}cc`),
        border: `1.5px solid ${active ? z.color : (isDark ? z.bgDark + 'aa' : z.color + '44')}`,
        boxShadow: active ? `0 6px 20px ${z.color}55` : 'none',
        color: active ? '#fff' : (isDark ? '#f5f5f4' : z.color)
      }}>
        <span className="text-base leading-none">{z.emoji}</span>
        <span className={`font-bold leading-tight ${tall ? 'text-[10px]' : 'text-[10px]'}`} style={{ writingMode: tall ? 'vertical-rl' : 'horizontal-tb', transform: tall ? 'rotate(180deg)' : 'none' }}>{z.name}</span>
        {active && <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white shadow flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: z.color }} /></div>}
      </div>
    );
  };

  return (
    <div className={`${t.surface} border ${t.border} rounded-3xl p-4 ${t.cardShadow}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center"><MapPin size={15} className="text-white" /></div>
          <div className={`font-bold text-sm ${t.text}`}>Plan du magasin</div>
        </div>
        <div className={`text-[11px] ${t.textMuted} font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}><DoorOpen size={11} /> Entrée</div>
      </div>

      {/* Sol du magasin */}
      <div className={`rounded-2xl p-2.5 ${isDark ? 'bg-stone-900/40' : 'bg-stone-100/70'}`}>

        {/* MUR DU HAUT : entrée + caisses + sections d'accueil */}
        <div className="flex gap-1.5 mb-1.5" style={{ height: '52px' }}>
          <div className="rounded-xl flex flex-col items-center justify-center text-white shadow-md shrink-0" style={{ width: '64px', background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
            <DoorOpen size={16} /><span className="text-[8px] font-extrabold mt-0.5">ENTRÉE</span>
          </div>
          <div className="rounded-xl flex flex-col items-center justify-center text-stone-900 shadow-md shrink-0" style={{ width: '64px', background: 'linear-gradient(135deg,#fde047,#facc15)' }}>
            <ShoppingCart size={16} /><span className="text-[8px] font-extrabold mt-0.5">CAISSES</span>
          </div>
          <Wall zone="fleurs" className="flex-1" />
          <Wall zone="boulangerie" className="flex-1" />
          <Wall zone="pret-a-manger" className="flex-1" />
        </div>

        {/* CORPS : mur gauche (fruits) + allées empilées + mur droit (frais) */}
        <div className="flex gap-1.5">
          {/* Mur gauche */}
          <Wall zone="fruits-legumes" className="w-12 shrink-0" tall />

          {/* Allées horizontales empilées */}
          <div className="flex-1 flex flex-col gap-1.5">
            {Object.keys(AISLES).map(num => {
              const n = parseInt(num);
              const isNatural = n <= 2;
              const isHighlighted = highlightAisle === n;
              const inPath = shoppingPath.includes(n);
              const pathIndex = shoppingPath.indexOf(n);
              const bg = isHighlighted
                ? 'linear-gradient(90deg,#f87171,#dc2626)'
                : inPath
                ? 'linear-gradient(90deg,#fde047,#f59e0b)'
                : isNatural
                ? (isDark ? 'linear-gradient(90deg,#166534,#14532d)' : 'linear-gradient(90deg,#dcfce7,#bbf7d0)')
                : (isDark ? 'linear-gradient(90deg,#44403c,#292524)' : 'linear-gradient(90deg,#ffffff,#f8f7f6)');
              const txt = isHighlighted ? '#fff' : inPath ? '#78350f' : isNatural ? (isDark ? '#dcfce7' : '#15803d') : (isDark ? '#f5f5f4' : '#57534e');
              return (
                <div key={num} className={`relative rounded-lg flex items-center gap-3 px-3 transition-all duration-300 ${isHighlighted ? 'scale-[1.02] z-10' : ''}`} style={{
                  height: '30px',
                  background: bg,
                  border: isHighlighted ? '2px solid #b91c1c' : inPath ? '2px solid #d97706' : isNatural ? (isDark ? '1.5px solid #166534' : '1.5px solid #86efac') : `1.5px solid ${isDark ? '#57534e' : '#e7e5e4'}`,
                  color: txt,
                  boxShadow: isHighlighted ? '0 6px 20px rgba(220,38,38,0.4)' : 'none'
                }}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-xs shrink-0 ${isHighlighted || inPath ? 'bg-white/30' : isNatural ? (isDark ? 'bg-green-900/50' : 'bg-green-200/70') : (isDark ? 'bg-stone-700' : 'bg-stone-100')}`}>{n}</div>
                  <div className="text-[11px] font-bold tracking-tight truncate">{AISLE_LABELS[n]}</div>
                  {inPath && pathIndex >= 0 && <div className="absolute right-2 w-5 h-5 rounded-full bg-white text-amber-700 flex items-center justify-center font-extrabold text-[10px] shadow">{pathIndex + 1}</div>}
                  {isHighlighted && <div className="absolute right-2 flex items-center gap-1 text-[10px] font-extrabold"><MapPin size={11} /> ICI</div>}
                </div>
              );
            })}
          </div>

          {/* Mur droit */}
          <Wall zone="surgeles" className="w-12 shrink-0" tall />
        </div>

        {/* MUR DU BAS : réserve + viandes + poissonnerie + charcuterie + laitiers */}
        <div className="flex gap-1.5 mt-1.5" style={{ height: '52px' }}>
          <div className={`rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-stone-800 text-stone-400' : 'bg-stone-200 text-stone-500'}`} style={{ width: '64px' }}>
            <span className="text-[9px] font-bold text-center leading-tight">🚪 Réserve</span>
          </div>
          <Wall zone="viandes" className="flex-1" />
          <Wall zone="poissonnerie" className="flex-1" />
          <Wall zone="charcuterie" className="flex-1" />
          <Wall zone="produits-laitiers" className="flex-1" />
        </div>
      </div>

      {/* Légende */}
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t ${t.border}`}>
        {[['linear-gradient(135deg,#bbf7d0,#dcfce7)','Produits naturels'],['linear-gradient(135deg,#ffffff,#f8f7f6)','Épicerie'],['linear-gradient(135deg,#f87171,#dc2626)','Destination'],['linear-gradient(135deg,#fde047,#f59e0b)','Mon parcours']].map(([bg,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-[11px]"><div className="w-4 h-4 rounded-md border" style={{ background: isDark && l === 'Épicerie' ? 'linear-gradient(135deg,#44403c,#292524)' : bg, borderColor: isDark ? '#57534e' : '#e7e5e4' }}></div><span className={`${t.textSecondary} font-medium`}>{l}</span></div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// SCANNER
// ============================================================
const BarcodeScanner = ({ onClose, onResult, theme }) => {
  const { t } = theme;
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleScan = async () => {
    if (!barcode.trim()) return;
    setLoading(true); setError('');
    const p = await fetchByBarcode(barcode.trim());
    setLoading(false);
    if (!p) { setError('Produit introuvable 😕'); return; }
    onResult(p);
  };
  const examples = [{ code: '5449000000996', name: 'Coca-Cola' }, { code: '7622210449283', name: 'Oreo' }, { code: '3017620422003', name: 'Nutella' }, { code: '0628915046281', name: 'Lait Natrel' }];
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-up">
      <div className={`${t.surface} rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><ScanLine size={20} className="text-red-600" /></div>
            <div><h3 className={`font-bold text-lg ${t.text}`}>Scanner</h3><p className={`text-xs ${t.textMuted}`}>Trouvez n'importe quel produit</p></div>
          </div>
          <button onClick={onClose} className={`${t.textMuted} p-1`}><X size={22} /></button>
        </div>
        <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-10 mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
          <div className="relative flex flex-col items-center"><ScanLine size={48} className="text-white mb-3" /><div className="text-yellow-300 text-xs font-semibold uppercase tracking-wider">Caméra en production</div></div>
        </div>
        <Field label="Code-barres" hint="Saisie manuelle pour démo" theme={theme}>
          <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleScan()} placeholder="0628915046281" className={`w-full ${t.input} px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all font-mono`} autoFocus />
        </Field>
        <div className="mt-4">
          <div className={`text-xs font-bold ${t.textMuted} mb-2`}>💡 Essayez ces exemples</div>
          <div className="flex flex-wrap gap-1.5">
            {examples.map(ex => <button key={ex.code} onClick={() => setBarcode(ex.code)} className={`text-xs ${theme.isDark ? 'bg-stone-700 hover:bg-stone-600 text-stone-200' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'} font-semibold px-3 py-1.5 rounded-full transition-colors`}>{ex.name}</button>)}
          </div>
        </div>
        {error && <div className="mt-3 bg-red-50 border-2 border-red-200 text-red-700 text-sm p-3 rounded-xl font-semibold">{error}</div>}
        <button onClick={handleScan} disabled={loading || !barcode.trim()} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl disabled:opacity-30 flex items-center justify-center gap-2 transition-colors shadow-md">
          {loading ? <><Loader size={18} className="animate-spin" />Recherche...</> : <><Search size={18} />Trouver</>}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// RECHERCHE
// ============================================================
const ProductSearch = ({ products, onSelectProduct, onAddToList, onMoveProduct, shoppingList, isEmployeeMode = false, favorites = [], onToggleFavorite, theme }) => {
  const { t, isDark } = theme;
  const [query, setQuery] = useState('');
  const [specialFilter, setSpecialFilter] = useState(null); // null | 'promo' | 'favorites'
  const [filterAisle, setFilterAisle] = useState(null);
  const [searchMode, setSearchMode] = useState('local');
  const [offResults, setOffResults] = useState([]);
  const [offLoading, setOffLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const localResults = useMemo(() => {
    let list = products;
    if (filterAisle !== null) list = list.filter(p => p.aisle === filterAisle);
    if (specialFilter === 'promo') list = list.filter(p => p.salePrice != null);
    if (specialFilter === 'favorites') list = list.filter(p => favorites.includes(p.id));
    if (!query.trim()) return list.slice(0, 50);
    const q = query.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q))));
  }, [query, filterAisle, specialFilter, products, favorites]);

  const runOffSearch = async () => {
    if (!query.trim()) return;
    setOffLoading(true);
    setOffResults(await searchOpenFoodFacts(query));
    setOffLoading(false);
    setSearchMode('off');
  };
  const inList = (p) => shoppingList?.find(i => i.product.id === p.id);
  const results = searchMode === 'off' ? offResults : localResults;

  return (
    <div className="animate-fade-up">
      {showScanner && <BarcodeScanner onClose={() => setShowScanner(false)} onResult={(p) => { setShowScanner(false); if (p) onSelectProduct(p); }} theme={theme} />}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input type="text" value={query} onChange={e => { setQuery(e.target.value); setSearchMode('local'); }} onKeyDown={e => e.key === 'Enter' && runOffSearch()} placeholder="Que cherchez-vous?" className={`w-full pl-12 pr-14 py-4 ${t.input} rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all text-base font-medium`} />
        <button onClick={() => setShowScanner(true)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition-colors shadow-md" title="Scanner"><ScanLine size={16} /></button>
      </div>
      <div className={`flex gap-1 mb-4 ${isDark ? 'bg-stone-800' : 'bg-stone-100'} p-1 rounded-2xl`}>
        <button onClick={() => setSearchMode('local')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${searchMode === 'local' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}><Database size={14} />Catalogue <span className="text-xs opacity-70">({products.length})</span></button>
        <button onClick={runOffSearch} disabled={!query.trim() || offLoading} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-30 ${searchMode === 'off' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>{offLoading ? <Loader size={14} className="animate-spin" /> : <Globe size={14} />}OFF <span className="text-xs opacity-70">(3M+)</span></button>
      </div>
      {searchMode === 'local' && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
          <FilterPill active={filterAisle === null && !specialFilter} onClick={() => { setFilterAisle(null); setSpecialFilter(null); }} theme={theme}>Tout</FilterPill>
          <FilterPill active={specialFilter === 'promo'} onClick={() => { setSpecialFilter(specialFilter === 'promo' ? null : 'promo'); setFilterAisle(null); }} color="red" theme={theme}>⚡ En promo</FilterPill>
          {!isEmployeeMode && onToggleFavorite && <FilterPill active={specialFilter === 'favorites'} onClick={() => { setSpecialFilter(specialFilter === 'favorites' ? null : 'favorites'); setFilterAisle(null); }} color="red" theme={theme}>❤️ Favoris</FilterPill>}
          <FilterPill active={filterAisle === 0 && !specialFilter} onClick={() => { setFilterAisle(0); setSpecialFilter(null); }} color="red" theme={theme}>🍎 Périmètre</FilterPill>
          {Object.keys(AISLES).map(n => { const num = parseInt(n); return <FilterPill key={n} active={filterAisle === num && !specialFilter} onClick={() => { setFilterAisle(num); setSpecialFilter(null); }} color={num <= 2 ? 'green' : 'red'} theme={theme}>Allée {n}</FilterPill>; })}
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className={`text-xs font-semibold ${t.textMuted}`}>{offLoading ? '🔄 Recherche en cours...' : `${results.length} résultat${results.length > 1 ? 's' : ''}`}</div>
        {query && <button onClick={() => setQuery('')} className={`text-xs ${t.textMuted} font-semibold`}>✕ Effacer</button>}
      </div>
      <div className="space-y-2 max-h-[55vh] overflow-y-auto -mx-1 px-1">
        {results.length === 0 && <div className={`text-center py-12 ${t.textMuted}`}><div className="text-5xl mb-3">🔍</div><div className={`font-bold text-lg ${t.textSecondary} mb-1`}>Aucun résultat</div><div className="text-sm">Essayez un autre terme ou cherchez dans Open Food Facts</div></div>}
        {results.map((p, i) => {
          const added = inList(p);
          return (
            <div key={p.id || i} className={`group ${t.surface} border-2 ${p.salePrice != null ? 'border-yellow-300' : t.border} rounded-2xl p-3 flex items-center gap-3 transition-all ${t.cardShadow}`}>
              <ProductImage src={p.image} alt={p.name} isDark={isDark} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className={`font-bold ${t.text} truncate`}>{p.name}</div>
                  <PromoBadge product={p} />
                </div>
                {p.brand && <div className={`text-xs ${t.textSecondary} truncate font-medium`}>{p.brand}</div>}
                <div className="mt-0.5"><PriceTag product={p} theme={theme} /></div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <AisleBadge aisle={p.aisle} side={p.side} zone={p.zone} small isDark={isDark} />
                  {p.source === 'off' && <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">OFF</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {!isEmployeeMode && onToggleFavorite && <FavoriteButton productId={p.id} favorites={favorites} onToggle={onToggleFavorite} theme={theme} size={14} />}
                <button onClick={() => onSelectProduct(p)} className={`${isDark ? 'bg-stone-700 hover:bg-stone-600 text-stone-200' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'} p-2 rounded-lg transition-colors`} title="Voir sur le plan"><MapPin size={14} /></button>
                {isEmployeeMode && onMoveProduct && p.aisle !== undefined && <button onClick={() => onMoveProduct(p)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-lg transition-colors" title="Déplacer"><Move size={14} /></button>}
                {!isEmployeeMode && <button onClick={() => onAddToList(p)} disabled={added || p.aisle === undefined} className={`p-2 rounded-lg transition-all ${added ? 'bg-green-500 text-white' : p.aisle === undefined ? (isDark ? 'bg-stone-700 text-stone-500' : 'bg-stone-100 text-stone-400') : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'}`} title={added ? 'Déjà ajouté' : 'Ajouter'}>{added ? <Check size={14} /> : <Plus size={14} />}</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// MODAL AJOUTER
// ============================================================
const AddProductModal = ({ onClose, onAdd, theme }) => {
  const { t, isDark } = theme;
  const [step, setStep] = useState('basics');
  const [name, setName] = useState(''); const [category, setCategory] = useState(''); const [brand, setBrand] = useState('');
  const [image, setImage] = useState(null); const [keywords, setKeywords] = useState('');
  const [destType, setDestType] = useState('aisle'); const [destAisle, setDestAisle] = useState(1);
  const [destSide, setDestSide] = useState('left'); const [destZone, setDestZone] = useState('fruits-legumes');
  const [offQuery, setOffQuery] = useState(''); const [offResults, setOffResults] = useState([]); const [offLoading, setOffLoading] = useState(false);

  const runOffSearch = async () => { if (!offQuery.trim()) return; setOffLoading(true); setOffResults(await searchOpenFoodFacts(offQuery)); setOffLoading(false); };
  const prefillFromOff = (p) => {
    setName(p.name); setBrand(p.brand || ''); setCategory(p.category || ''); setImage(p.image || null);
    if (p.aisle !== undefined) { if (p.aisle === 0) { setDestType('zone'); setDestZone(p.zone); } else { setDestType('aisle'); setDestAisle(p.aisle); setDestSide(p.side || 'left'); } }
    setStep('basics');
  };
  const handleSubmit = () => {
    if (!name.trim()) return;
    const np = { id: `custom-${Date.now()}`, name: name.trim(), category: category.trim() || 'Personnalisé', brand: brand.trim(), image: image || findPhoto(name, category), keywords: [name.toLowerCase(), ...(keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean))], source: 'custom' };
    if (destType === 'aisle') { np.aisle = destAisle; np.side = destSide; } else { np.aisle = 0; np.zone = destZone; }
    onAdd(np); onClose();
  };
  const inputCls = `w-full ${t.input} px-3 py-2.5 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-up">
      <div className={`${t.surface} rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${t.surface} border-b ${t.border} px-6 py-4 z-10`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><PackagePlus size={20} className="text-green-600" /></div>
              <div><h3 className={`font-bold text-lg ${t.text}`}>Nouveau produit</h3><p className={`text-xs ${t.textMuted}`}>Ajoutez-le au catalogue</p></div>
            </div>
            <button onClick={onClose} className={`${t.textMuted} p-1`}><X size={22} /></button>
          </div>
          <div className={`flex gap-1 ${isDark ? 'bg-stone-700' : 'bg-stone-100'} p-1 rounded-xl`}>
            {[['basics','Détails','✨'],['location','Position','📍'],['search-off','Import','🔍']].map(([id,label,emoji]) => (
              <button key={id} onClick={() => setStep(id)} className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${step === id ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}><span className="mr-1">{emoji}</span>{label}</button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {step === 'basics' && (
            <div className="space-y-4 animate-fade-up">
              <div className={`${t.surfaceAlt} border ${t.border} rounded-2xl p-4 flex items-center gap-3`}>
                <ProductImage src={image || (name ? findPhoto(name, category) : null)} alt={name || 'Nouveau'} isDark={isDark} />
                <div className="flex-1 min-w-0"><div className={`font-semibold ${t.text} truncate`}>{name || 'Nom du produit...'}</div>{brand && <div className={`text-xs ${t.textMuted} truncate`}>{brand}</div>}<div className={`text-xs ${t.textMuted} truncate mt-0.5`}>{category || 'Catégorie...'}</div></div>
              </div>
              <Field label="Nom du produit" required theme={theme}><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex. Lait d'avoine bio 1L" className={inputCls} autoFocus /></Field>
              <Field label="Marque" theme={theme}><input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="ex. Silk, Natrel..." className={inputCls} /></Field>
              <Field label="Catégorie" theme={theme}><input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="ex. Substituts de lait" className={inputCls} /></Field>
              <Field label="Mots-clés" hint="Séparés par virgules" theme={theme}><input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="ex. avoine, oat" className={inputCls} /></Field>
              <div className={`${t.surfaceAlt} border ${t.border} rounded-xl p-3 text-xs ${t.textMuted} flex items-center gap-2`}><Sparkles size={14} className="text-red-500 shrink-0" />L'icône du produit est choisie automatiquement selon son nom.</div>
              <button onClick={() => setStep('location')} disabled={!name.trim()} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl disabled:opacity-30 flex items-center justify-center gap-2 transition-all shadow-md">Suivant <ArrowRight size={16} /></button>
            </div>
          )}
          {step === 'location' && (
            <div className="space-y-4 animate-fade-up">
              <div className={`${t.surfaceAlt} border ${t.border} rounded-2xl p-4 flex items-center gap-3`}><ProductImage src={image} alt={name} isDark={isDark} /><div className="flex-1 min-w-0"><div className={`font-semibold ${t.text} truncate`}>{name}</div><div className={`text-xs ${t.textMuted} truncate`}>{category}</div></div></div>
              <div className={`flex gap-1 ${isDark ? 'bg-stone-700' : 'bg-stone-100'} p-1 rounded-xl`}>
                <button onClick={() => setDestType('aisle')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${destType === 'aisle' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>Allée</button>
                <button onClick={() => setDestType('zone')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${destType === 'zone' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>Périmètre</button>
              </div>
              {destType === 'aisle' && (
                <div className="space-y-4">
                  <Field label="Numéro d'allée" theme={theme}><div className="grid grid-cols-6 gap-1.5">{[1,2,3,4,5,6,7,8,9,10,11].map(n => <button key={n} onClick={() => setDestAisle(n)} className={`py-2.5 rounded-lg font-bold text-sm transition-all ${destAisle === n ? (n <= 2 ? 'bg-green-600 text-white shadow-md' : 'bg-red-600 text-white shadow-md') : (isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-700')}`}>{n}</button>)}</div></Field>
                  <Field label="Côté" theme={theme}><div className="grid grid-cols-2 gap-2">{[['left','Gauche'],['right','Droite']].map(([k,l]) => <button key={k} onClick={() => setDestSide(k)} className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${destSide === k ? 'bg-red-600 text-white shadow-md' : (isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-700')}`}>{l}</button>)}</div></Field>
                  <div className={`${t.surfaceAlt} border ${t.border} rounded-xl p-3`}><div className={`text-xs font-semibold ${t.textMuted} mb-1`}>📋 Catégories ({destSide === 'left' ? 'gauche' : 'droite'})</div><div className={`text-sm ${t.textSecondary}`}>{AISLES[destAisle][destSide].join(' · ')}</div></div>
                </div>
              )}
              {destType === 'zone' && <div className="grid grid-cols-2 gap-2">{Object.entries(PERIMETER_ZONES).map(([key, z]) => <button key={key} onClick={() => setDestZone(key)} className="p-3 rounded-xl text-left border-2 transition-all" style={{ backgroundColor: destZone === key ? (isDark ? z.bgDark + '80' : z.bg) : 'transparent', borderColor: destZone === key ? z.color : (isDark ? '#44403c' : '#e7e5e4') }}><div className="text-xl mb-1">{z.emoji}</div><div className={`font-semibold text-sm ${t.text}`}>{z.name}</div></button>)}</div>}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep('basics')} className={`flex-1 ${isDark ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-700'} font-bold py-3 rounded-xl transition-colors`}>← Retour</button>
                <button onClick={handleSubmit} disabled={!name.trim()} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl disabled:opacity-30 flex items-center justify-center gap-2 transition-all shadow-md"><Check size={16} />Créer</button>
              </div>
            </div>
          )}
          {step === 'search-off' && (
            <div className="space-y-3 animate-fade-up">
              <div className={`${t.surfaceAlt} border ${t.border} rounded-xl p-3 text-sm ${t.textSecondary}`}><div className="font-semibold mb-1 flex items-center gap-2"><Globe size={14} />Importer depuis Open Food Facts</div><p className={`text-xs ${t.textMuted}`}>3M+ produits avec photos prêtes</p></div>
              <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><input type="text" value={offQuery} onChange={e => setOffQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && runOffSearch()} placeholder="Rechercher..." className={`w-full ${t.input} pl-9 pr-3 py-2.5 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all`} autoFocus /></div>
              <button onClick={runOffSearch} disabled={!offQuery.trim() || offLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-30 flex items-center justify-center gap-2 text-sm transition-colors">{offLoading ? <><Loader size={14} className="animate-spin" />Recherche...</> : <><Globe size={14} />Chercher</>}</button>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">{offResults.map(p => <button key={p.id} onClick={() => prefillFromOff(p)} className={`w-full ${t.surfaceAlt} border ${t.border} rounded-xl p-2 flex items-center gap-2 text-left transition-colors`}><ProductImage src={p.image} alt={p.name} size="sm" isDark={isDark} /><div className="flex-1 min-w-0"><div className={`text-sm font-medium ${t.text} truncate`}>{p.name}</div>{p.brand && <div className={`text-xs ${t.textMuted} truncate`}>{p.brand}</div>}</div><ChevronRight size={14} className={t.textMuted} /></button>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MODAL DÉPLACER
// ============================================================
const MoveProductModal = ({ product, onClose, onMove, theme }) => {
  const { t, isDark } = theme;
  const [destType, setDestType] = useState(product.aisle === 0 ? 'zone' : 'aisle');
  const [destAisle, setDestAisle] = useState(product.aisle || 1);
  const [destSide, setDestSide] = useState(product.side || 'left');
  const [destZone, setDestZone] = useState(product.zone || 'fruits-legumes');
  const handleMove = () => { if (destType === 'aisle') onMove({ aisle: destAisle, side: destSide, zone: undefined }); else onMove({ aisle: 0, zone: destZone, side: undefined }); onClose(); };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-up">
      <div className={`${t.surface} rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${t.surface} border-b ${t.border} px-6 py-4 flex items-center justify-between z-10`}>
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center"><Move size={20} className="text-yellow-700" /></div><div><h3 className={`font-bold text-lg ${t.text}`}>Déplacer</h3><p className={`text-xs ${t.textMuted}`}>Nouvel emplacement</p></div></div>
          <button onClick={onClose} className={`${t.textMuted} p-1`}><X size={22} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className={`${t.surfaceAlt} border ${t.border} rounded-2xl p-4 flex items-center gap-3`}><ProductImage src={product.image} alt={product.name} isDark={isDark} /><div className="flex-1 min-w-0"><div className={`font-semibold ${t.text} truncate`}>{product.name}</div><div className={`text-xs ${t.textMuted} truncate`}>{product.category}</div></div></div>
          <div className={`${t.surfaceAlt} rounded-2xl p-4 border ${t.border}`}>
            <div className={`text-xs font-bold ${t.textMuted} mb-3 uppercase tracking-wide`}>🚚 Trajectoire</div>
            <div className="flex items-center gap-3">
              <div className="flex-1"><div className={`text-[10px] ${t.textMuted} mb-1`}>Depuis</div><AisleBadge aisle={product.aisle} side={product.side} zone={product.zone} small isDark={isDark} /></div>
              <ArrowRight size={20} className="text-red-500" />
              <div className="flex-1"><div className={`text-[10px] ${t.textMuted} mb-1`}>Vers</div><AisleBadge aisle={destType === 'aisle' ? destAisle : 0} side={destType === 'aisle' ? destSide : undefined} zone={destType === 'zone' ? destZone : undefined} small isDark={isDark} /></div>
            </div>
          </div>
          <div className={`flex gap-1 ${isDark ? 'bg-stone-700' : 'bg-stone-100'} p-1 rounded-xl`}>
            <button onClick={() => setDestType('aisle')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${destType === 'aisle' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>Allée</button>
            <button onClick={() => setDestType('zone')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${destType === 'zone' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>Périmètre</button>
          </div>
          {destType === 'aisle' && (
            <div className="space-y-4">
              <Field label="Numéro d'allée" theme={theme}><div className="grid grid-cols-6 gap-1.5">{[1,2,3,4,5,6,7,8,9,10,11].map(n => <button key={n} onClick={() => setDestAisle(n)} className={`py-2.5 rounded-lg font-bold text-sm transition-all ${destAisle === n ? (n <= 2 ? 'bg-green-600 text-white shadow-md' : 'bg-red-600 text-white shadow-md') : (isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-700')}`}>{n}</button>)}</div></Field>
              <Field label="Côté" theme={theme}><div className="grid grid-cols-2 gap-2">{[['left','Gauche'],['right','Droite']].map(([k,l]) => <button key={k} onClick={() => setDestSide(k)} className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${destSide === k ? 'bg-red-600 text-white shadow-md' : (isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-700')}`}>{l}</button>)}</div></Field>
              <div className={`${t.surfaceAlt} border ${t.border} rounded-xl p-3`}><div className={`text-xs font-semibold ${t.textMuted} mb-1`}>📋 Catégories</div><div className={`text-sm ${t.textSecondary}`}>{AISLES[destAisle][destSide].join(' · ')}</div></div>
            </div>
          )}
          {destType === 'zone' && <div className="grid grid-cols-2 gap-2">{Object.entries(PERIMETER_ZONES).map(([key, z]) => <button key={key} onClick={() => setDestZone(key)} className="p-3 rounded-xl text-left border-2 transition-all" style={{ backgroundColor: destZone === key ? (isDark ? z.bgDark + '80' : z.bg) : 'transparent', borderColor: destZone === key ? z.color : (isDark ? '#44403c' : '#e7e5e4') }}><div className="text-xl mb-1">{z.emoji}</div><div className={`font-semibold text-sm ${t.text}`}>{z.name}</div></button>)}</div>}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className={`flex-1 ${isDark ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-700'} font-bold py-3 rounded-xl transition-colors`}>Annuler</button>
            <button onClick={handleMove} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"><Save size={16} />Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PARCOURS PAR CATÉGORIES
// ============================================================
const AisleCard = ({ num, products, onClick, theme }) => {
  const { t, isDark } = theme;
  const aisle = AISLES[num];
  const isNatural = num <= 2;
  const count = products.filter(p => p.aisle === num).length;
  return (
    <button onClick={onClick} className={`group w-full p-4 rounded-2xl text-left transition-all ${t.surface} border-2 ${isNatural ? (isDark ? 'border-green-900/60' : 'border-green-200') : (isDark ? 'border-red-900/60' : 'border-red-200')} ${t.cardShadow}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-md ${isNatural ? 'bg-green-600' : 'bg-red-600'}`}>{num}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold ${isNatural ? 'text-green-700' : 'text-red-700'} mb-1`}>{aisle.section}</div>
          <div className={`text-sm ${t.textSecondary} truncate`}>{[...aisle.left, ...aisle.right].slice(0, 3).join(' · ')}</div>
          <div className={`text-xs ${t.textMuted} mt-1 font-medium`}>{count} produits · {[...aisle.left, ...aisle.right].length} catégories</div>
        </div>
        <ChevronRight size={20} className={`${t.textMuted} group-hover:translate-x-0.5 transition-transform`} />
      </div>
    </button>
  );
};

const BrowseCategories = ({ onSelectAisle, onSelectZone, products, theme }) => {
  const { t, isDark } = theme;
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="mb-4"><h2 className={`font-bold text-2xl ${t.text}`}>Sections fraîches 🌿</h2><p className={`text-sm ${t.textMuted}`}>Tout autour du magasin</p></div>
        <div className="grid grid-cols-2 gap-2.5">
          {Object.entries(PERIMETER_ZONES).map(([key, z]) => {
            const count = products.filter(p => p.zone === key).length;
            return (
              <button key={key} onClick={() => onSelectZone(key)} className={`group relative p-4 rounded-2xl text-left border-2 transition-all hover:scale-[1.02] ${t.cardShadow}`} style={{ backgroundColor: isDark ? z.bgDark + '40' : z.bg, borderColor: isDark ? z.bgDark + '80' : z.color + '30' }}>
                <div className="flex items-start justify-between mb-2"><div className="text-3xl">{z.emoji}</div><ArrowUpRight size={14} className={isDark ? 'text-stone-400' : 'text-stone-500'} /></div>
                <div className={`font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} text-sm mb-1`}>{z.name}</div>
                <div className="text-xs font-semibold" style={{ color: isDark ? '#fafafa' : z.color }}>{count} produits</div>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div className="mb-4"><h2 className={`font-bold text-2xl ${t.text}`}>11 allées centrales 🛒</h2><p className={`text-sm ${t.textMuted}`}>Le cœur de l'épicerie</p></div>
        <div className="space-y-2">{[1,2,3,4,5,6,7,8,9,10,11].map(n => <AisleCard key={n} num={n} products={products} onClick={() => onSelectAisle(n)} theme={theme} />)}</div>
      </div>
    </div>
  );
};

const AisleDetail = ({ aisleNum, products, onBack, theme }) => {
  const { t, isDark } = theme;
  const aisle = AISLES[aisleNum];
  const isNatural = aisleNum <= 2;
  const aisleProducts = products.filter(p => p.aisle === aisleNum);
  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className={`text-sm ${t.textSecondary} font-semibold mb-4 flex items-center gap-1 transition-colors`}>← Retour</button>
      <div className={`relative mb-6 p-6 rounded-3xl ${isNatural ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-red-500 to-red-700'} text-white overflow-hidden shadow-xl`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative"><div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-90">{aisle.section}</div><div className="text-6xl font-bold leading-none mb-2">Allée {aisleNum}</div><div className="flex items-center gap-3 text-sm opacity-90 mt-3"><span className="font-semibold">{aisleProducts.length} produits</span><span className="opacity-50">•</span><span>{[...aisle.left, ...aisle.right].length} catégories</span></div></div>
      </div>
      <StoreMap highlightAisle={aisleNum} theme={theme} />
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div><div className={`text-xs font-bold ${t.textMuted} mb-2 uppercase tracking-wide`}>← Côté gauche</div><div className="space-y-1.5">{aisle.left.map(cat => <div key={cat} className={`${t.surfaceAlt} border ${t.border} px-3 py-2 rounded-lg text-sm ${t.textSecondary} font-medium`}>{cat}</div>)}</div></div>
        <div><div className={`text-xs font-bold ${t.textMuted} mb-2 uppercase tracking-wide`}>Côté droit →</div><div className="space-y-1.5">{aisle.right.map(cat => <div key={cat} className={`${t.surfaceAlt} border ${t.border} px-3 py-2 rounded-lg text-sm ${t.textSecondary} font-medium`}>{cat}</div>)}</div></div>
      </div>
      <div className="mt-6"><div className={`text-xs font-bold ${t.textMuted} mb-3 uppercase tracking-wide`}>📦 Tous les produits</div><div className="space-y-1.5 max-h-80 overflow-y-auto">{aisleProducts.map(p => <div key={p.id} className={`${t.surface} border ${t.border} px-3 py-2 rounded-xl text-sm flex items-center gap-3`}><ProductImage src={p.image} alt={p.name} size="sm" isDark={isDark} /><span className={`flex-1 ${t.textSecondary}`}>{p.name}</span><span className={`text-xs ${t.textMuted} font-medium`}>{p.side === 'left' ? '← G' : 'D →'}</span></div>)}</div></div>
    </div>
  );
};

const ZoneDetail = ({ zoneKey, products, onBack, theme }) => {
  const { t, isDark } = theme;
  const z = PERIMETER_ZONES[zoneKey];
  const zoneProducts = products.filter(p => p.zone === zoneKey);
  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className={`text-sm ${t.textSecondary} font-semibold mb-4 flex items-center gap-1`}>← Retour</button>
      <div className="relative mb-6 p-6 rounded-3xl text-white overflow-hidden shadow-xl" style={{ background: `linear-gradient(135deg, ${z.color}, ${z.color}dd)` }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative"><div className="text-5xl mb-3">{z.emoji}</div><div className="text-3xl font-bold leading-tight">{z.name}</div><div className="text-sm opacity-90 mt-2 font-medium">{zoneProducts.length} produits frais</div></div>
      </div>
      <StoreMap highlightZone={zoneKey} theme={theme} />
      <div className="mt-6"><div className={`text-xs font-bold ${t.textMuted} mb-3 uppercase tracking-wide`}>🛍️ Les produits</div><div className="space-y-1.5 max-h-96 overflow-y-auto">{zoneProducts.length === 0 ? <div className={`text-sm ${t.textMuted} italic p-3`}>Aucun produit</div> : zoneProducts.map(p => <div key={p.id} className={`${t.surface} border ${t.border} px-3 py-2 rounded-xl text-sm flex items-center gap-3`}><ProductImage src={p.image} alt={p.name} size="sm" isDark={isDark} /><span className={`flex-1 ${t.textSecondary}`}>{p.name}</span></div>)}</div></div>
    </div>
  );
};

// ============================================================
// LISTE D'ACHATS
// ============================================================
const ZONE_ORDER_START = ['fruits-legumes', 'boulangerie', 'pret-a-manger', 'fleurs'];
const ZONE_ORDER_END = ['surgeles', 'viandes', 'charcuterie', 'poissonnerie', 'produits-laitiers'];
const getSortKey = (item) => {
  const p = item.product;
  if (p.aisle === 0) { if (ZONE_ORDER_START.includes(p.zone)) return ZONE_ORDER_START.indexOf(p.zone); return 100 + (ZONE_ORDER_END.indexOf(p.zone) >= 0 ? ZONE_ORDER_END.indexOf(p.zone) : 99); }
  if (p.aisle === undefined) return 999;
  return 10 + p.aisle;
};

const ShoppingList = ({ list, onRemove, onToggle, onClear, theme }) => {
  const { t, isDark } = theme;
  const [navMode, setNavMode] = useState(false);
  const [navStep, setNavStep] = useState(0);
  const sortedList = useMemo(() => [...list].sort((a, b) => getSortKey(a) - getSortKey(b)), [list]);
  const aislePath = useMemo(() => [...new Set(sortedList.filter(i => !i.checked && i.product.aisle > 0).map(i => i.product.aisle))], [sortedList]);
  const pathSteps = useMemo(() => {
    const steps = []; const seenA = new Set(); const seenZ = new Set();
    sortedList.filter(i => !i.checked).forEach(item => {
      if (item.product.aisle === 0 && !seenZ.has(item.product.zone)) { seenZ.add(item.product.zone); steps.push(PERIMETER_ZONES[item.product.zone]?.name); }
      else if (item.product.aisle > 0 && !seenA.has(item.product.aisle)) { seenA.add(item.product.aisle); steps.push(`Allée ${item.product.aisle}`); }
    });
    return steps;
  }, [sortedList]);
  const grouped = useMemo(() => {
    const groups = {};
    sortedList.forEach(item => { const key = item.product.aisle === 0 ? `zone-${item.product.zone}` : `aisle-${item.product.aisle}`; if (!groups[key]) groups[key] = { items: [], sortKey: getSortKey(item) }; groups[key].items.push(item); });
    return groups;
  }, [sortedList]);

  // Arrêts du parcours pour la navigation pas à pas (groupes ordonnés)
  const navStops = useMemo(() => {
    return Object.entries(grouped).sort((a, b) => a[1].sortKey - b[1].sortKey).map(([key, group]) => {
      const p = group.items[0].product;
      const label = p.aisle === 0 ? PERIMETER_ZONES[p.zone]?.name : `Allée ${p.aisle}`;
      const emoji = p.aisle === 0 ? PERIMETER_ZONES[p.zone]?.emoji : '🛒';
      return { key, label, emoji, aisle: p.aisle, zone: p.zone, side: p.side, items: group.items };
    });
  }, [grouped]);

  if (list.length === 0) return <div className="text-center py-16 animate-fade-up"><div className="text-7xl mb-4">🛒</div><div className={`font-bold text-2xl ${t.text} mb-2`}>Votre panier est vide</div><div className={`text-sm ${t.textMuted}`}>Commencez par chercher un produit que vous aimez</div></div>;
  const completed = list.filter(i => i.checked).length;
  const progress = (completed / list.length) * 100;
  const totalRegular = list.reduce((s, i) => s + (i.product.price || 0), 0);
  const totalActual = list.reduce((s, i) => s + (i.product.salePrice != null ? i.product.salePrice : (i.product.price || 0)), 0);
  const savings = totalRegular - totalActual;

  // ===== MODE NAVIGATION PAS À PAS =====
  if (navMode && navStops.length > 0) {
    const stop = navStops[Math.min(navStep, navStops.length - 1)];
    const isLast = navStep >= navStops.length - 1;
    const stopDone = stop.items.every(i => i.checked);
    return (
      <div className="animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setNavMode(false)} className={`text-sm ${t.textSecondary} font-semibold flex items-center gap-1`}>← Quitter le parcours</button>
          <div className={`text-xs font-bold ${t.textMuted}`}>Arrêt {navStep + 1} / {navStops.length}</div>
        </div>

        {/* Barre de progression des arrêts */}
        <div className="flex gap-1.5 mb-6">
          {navStops.map((s, i) => (
            <div key={s.key} className={`flex-1 h-1.5 rounded-full transition-all ${i < navStep ? 'bg-green-500' : i === navStep ? 'bg-red-600' : (isDark ? 'bg-stone-700' : 'bg-stone-200')}`} />
          ))}
        </div>

        {/* Carte du grand arrêt actuel */}
        <div className="relative mb-6 p-8 rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white overflow-hidden shadow-xl text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Dirigez-vous vers</div>
            <div className="text-7xl mb-3">{stop.emoji}</div>
            <div className="text-4xl font-bold leading-none">{stop.label}</div>
            {stop.side && stop.side !== 'perimeter' && <div className="text-sm opacity-90 mt-2 font-semibold">Côté {stop.side === 'left' ? 'gauche' : 'droit'}</div>}
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
              <Package size={14} /> {stop.items.length} produit{stop.items.length > 1 ? 's' : ''} ici
            </div>
          </div>
        </div>

        {/* Mini-plan ciblé */}
        <StoreMap highlightAisle={stop.aisle > 0 ? stop.aisle : null} highlightZone={stop.aisle === 0 ? stop.zone : null} theme={theme} />

        {/* Produits à prendre à cet arrêt */}
        <div className="mt-6 space-y-2">
          <div className={`text-xs font-bold ${t.textMuted} uppercase tracking-wide mb-2`}>À prendre ici :</div>
          {stop.items.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${item.checked ? 'bg-green-50 border-green-200' : `${t.surface} ${t.border}`} ${t.cardShadow}`}>
              <button onClick={() => onToggle(item)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-green-500 border-green-500' : `${t.borderStrong}`}`}>{item.checked && <Check size={15} className="text-white" />}</button>
              <ProductImage src={item.product.image} alt={item.product.name} size="sm" isDark={isDark} />
              <div className="flex-1 min-w-0"><div className={`font-semibold text-sm ${item.checked ? `line-through ${t.textMuted}` : t.text}`}>{item.product.name}</div><PriceTag product={item.product} theme={theme} /></div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mt-6 sticky bottom-4">
          {navStep > 0 && <button onClick={() => setNavStep(s => s - 1)} className={`px-5 ${isDark ? 'bg-stone-700 text-stone-200' : 'bg-white text-stone-700'} border-2 ${t.border} font-bold py-3.5 rounded-2xl transition-colors shadow-md`}>←</button>}
          {!isLast ? (
            <button onClick={() => setNavStep(s => s + 1)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md">
              Arrêt suivant <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={() => setNavMode(false)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md">
              <Check size={18} /> Magasinage terminé!
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="relative mb-6 p-5 rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div><div className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">Mon panier</div><div className="text-4xl font-bold leading-none">{completed} <span className="opacity-60 text-2xl">/ {list.length}</span></div><div className="text-sm opacity-90 mt-1">produit{list.length > 1 ? 's' : ''} prêt{list.length > 1 ? 's' : ''}</div></div>
            <button onClick={onClear} className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">↻ Effacer</button>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3"><div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          <div className="flex items-center justify-between bg-white/15 backdrop-blur rounded-2xl px-4 py-3 mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider opacity-90 font-bold">Total estimé</div>
              <div className="text-2xl font-bold">{totalActual.toFixed(2)}$</div>
            </div>
            {savings > 0 && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider opacity-90 font-bold">Vous économisez</div>
                <div className="text-lg font-bold text-yellow-300">−{savings.toFixed(2)}$</div>
              </div>
            )}
          </div>
          {pathSteps.length > 0 && <div><div className="text-[10px] uppercase tracking-wider opacity-90 mb-1.5 font-bold">🗺️ Parcours suggéré</div><div className="flex flex-wrap items-center gap-1 text-xs">{pathSteps.map((s, i) => <React.Fragment key={i}><span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full font-semibold">{s}</span>{i < pathSteps.length - 1 && <span className="opacity-50">→</span>}</React.Fragment>)}</div></div>}
        </div>
      </div>

      {/* Bouton démarrer la navigation pas à pas */}
      {navStops.length > 0 && (
        <button onClick={() => { setNavStep(0); setNavMode(true); }} className="w-full mb-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg">
          <Navigation size={20} /> Démarrer le parcours guidé
        </button>
      )}

      <StoreMap shoppingPath={aislePath} theme={theme} />
      <div className="mt-6 space-y-5">
        {Object.entries(grouped).sort((a, b) => a[1].sortKey - b[1].sortKey).map(([key, group]) => {
          const first = group.items[0];
          return (
            <div key={key}>
              <div className={`flex items-center justify-between gap-2 mb-2 pb-2 border-b-2 ${t.border}`}><AisleBadge aisle={first.product.aisle} side={first.product.side} zone={first.product.zone} isDark={isDark} /><div className={`text-xs font-bold ${t.textMuted}`}>{group.items.length} item{group.items.length > 1 ? 's' : ''}</div></div>
              <div className="space-y-2">
                {group.items.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${item.checked ? `${t.surfaceAlt} opacity-50` : `${t.surface} ${t.border}`} ${t.cardShadow}`}>
                    <button onClick={() => onToggle(item)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-green-500 border-green-500' : `${t.borderStrong}`}`}>{item.checked && <Check size={13} className="text-white" />}</button>
                    <ProductImage src={item.product.image} alt={item.product.name} size="sm" isDark={isDark} />
                    <div className="flex-1 min-w-0"><div className={`font-semibold text-sm ${item.checked ? `line-through ${t.textMuted}` : t.text}`}>{item.product.name}</div><div className="flex items-center gap-2"><PriceTag product={item.product} theme={theme} /><PromoBadge product={item.product} /></div></div>
                    <button onClick={() => onRemove(item)} className={`${t.textMuted} hover:text-red-500 p-1.5 rounded-lg transition-colors`}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// MODE EMPLOYÉ
// ============================================================
const EmployeeMode = ({ products, onSelectProduct, onMoveProduct, onAddProduct, recentMoves, recentAdds, theme }) => {
  const { t, isDark } = theme;
  const [tab, setTab] = useState('catalog');
  const [inventory, setInventory] = useState([
    { id: 1, product: 'Lait 2% 2L', aisle: 0, zone: 'produits-laitiers', stock: 24, lowStock: 10, image: findPhoto('lait') },
    { id: 2, product: 'Pain frais', aisle: 0, zone: 'boulangerie', stock: 8, lowStock: 15, image: findPhoto('pain') },
    { id: 3, product: 'Cola 2L', aisle: 11, side: 'right', stock: 4, lowStock: 10, image: findPhoto('cola') },
    { id: 4, product: 'Couches taille 4', aisle: 3, side: 'left', stock: 32, lowStock: 8, image: findPhoto('couche') },
    { id: 5, product: 'Café moulu', aisle: 9, side: 'left', stock: 2, lowStock: 6, image: findPhoto('café') },
    { id: 6, product: 'Spaghetti', aisle: 7, side: 'right', stock: 45, lowStock: 20, image: findPhoto('spaghetti') },
    { id: 7, product: 'Saumon frais', aisle: 0, zone: 'poissonnerie', stock: 6, lowStock: 5, image: findPhoto('saumon') },
    { id: 8, product: 'Pizza surgelée', aisle: 0, zone: 'surgeles', stock: 3, lowStock: 8, image: findPhoto('pizza surgelée') }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const lowStockItems = inventory.filter(i => i.stock <= i.lowStock);

  const startEdit = (item) => { setEditingId(item.id); setEditValue(item.stock.toString()); };
  const saveEdit = (id) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: parseInt(editValue) || 0 } : i));
    setEditingId(null);
  };

  const TabBtn = ({ id, label, emoji, badge, badgeColor = 'red' }) => (
    <button onClick={() => setTab(id)} className={`flex-shrink-0 px-3 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${tab === id ? `${t.surface} ${t.text} shadow-md` : t.textMuted}`}>
      <span>{emoji}</span>{label}
      {badge > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
          tab === id ? 'bg-red-600 text-white' : badgeColor === 'red' ? 'bg-red-100 text-red-700' : badgeColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>{badge}</span>
      )}
    </button>
  );

  return (
    <div className="animate-fade-up">
      <div className="mb-5 p-5 rounded-3xl bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">👋 Bonjour</div>
            <div className="font-bold text-xl">Espace employé</div>
            <div className="text-xs opacity-80 mt-0.5">Tous les outils pour gérer le magasin</div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold">En service</span>
          </div>
        </div>
      </div>

      <div className={`flex gap-1 mb-5 ${isDark ? 'bg-stone-800' : 'bg-stone-100'} p-1 rounded-2xl overflow-x-auto`}>
        <TabBtn id="catalog" label="Catalogue" emoji="📦" />
        <TabBtn id="inventory" label="Stocks" emoji="📊" />
        <TabBtn id="alerts" label="Alertes" emoji="⚠️" badge={lowStockItems.length} badgeColor="red" />
        <TabBtn id="adds" label="Ajouts" emoji="➕" badge={recentAdds?.length || 0} badgeColor="green" />
        <TabBtn id="moves" label="Déplacements" emoji="🚚" badge={recentMoves.length} badgeColor="yellow" />
        <TabBtn id="stats" label="Vue d'ensemble" emoji="📈" />
        <TabBtn id="circular" label="Circulaire IA" emoji="✨" />
      </div>

      {tab === 'catalog' && (
        <div>
          <button onClick={onAddProduct} className="w-full mb-5 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <PackagePlus size={22} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">Ajouter un nouveau produit</div>
                  <div className="text-xs opacity-90">Étendez votre catalogue</div>
                </div>
              </div>
              <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
          <ProductSearch products={products} onSelectProduct={onSelectProduct} onMoveProduct={onMoveProduct} shoppingList={[]} isEmployeeMode={true} theme={theme} />
        </div>
      )}

      {tab === 'inventory' && (
        <div className="space-y-2.5">
          {inventory.map(item => {
            const isLow = item.stock <= item.lowStock;
            return (
              <div key={item.id} className={`p-3 rounded-2xl border-2 transition-all ${isLow ? 'border-red-300 bg-red-50' : `${t.border} ${t.surface}`} ${t.cardShadow}`}>
                <div className="flex items-start justify-between gap-3">
                  <ProductImage src={item.image} alt={item.product} size="sm" isDark={isDark} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold ${isLow ? 'text-red-900' : t.text} truncate`}>{item.product}</div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <AisleBadge aisle={item.aisle} side={item.side} zone={item.zone} small isDark={isDark} />
                      {isLow && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">⚠️ Critique</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className={`w-14 ${t.input} px-2 py-1 rounded-lg text-center font-bold border-2`} autoFocus />
                        <button onClick={() => saveEdit(item.id)} className="bg-green-500 text-white p-1.5 rounded-lg"><Save size={13} /></button>
                        <button onClick={() => setEditingId(null)} className={`${isDark ? 'bg-stone-700' : 'bg-stone-200'} ${t.textSecondary} p-1.5 rounded-lg`}><X size={13} /></button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(item)} className="flex items-center gap-1 group">
                        <div className={`text-3xl font-bold leading-none ${isLow ? 'text-red-600' : t.text}`}>{item.stock}</div>
                        <Edit3 size={12} className={`${t.textMuted} group-hover:text-red-600`} />
                      </button>
                    )}
                    <div className={`text-[10px] ${t.textMuted} font-medium mt-1`}>min · {item.lowStock}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'alerts' && (
        <div>
          {lowStockItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-3">✅</div>
              <div className={`font-bold text-xl ${t.text} mb-1`}>Tout va bien!</div>
              <div className={`text-sm ${t.textMuted}`}>Aucune action requise pour le moment</div>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">⚠️</div>
                  <div>
                    <div className="font-bold text-red-900">{lowStockItems.length} alerte{lowStockItems.length > 1 ? 's' : ''} critique{lowStockItems.length > 1 ? 's' : ''}</div>
                    <div className="text-xs text-red-700 font-semibold">Réapprovisionnement requis</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className={`${t.surface} border-2 border-red-200 rounded-2xl p-3 ${t.cardShadow}`}>
                    <div className="flex items-center justify-between gap-3">
                      <ProductImage src={item.image} alt={item.product} size="sm" isDark={isDark} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold ${t.text} truncate`}>{item.product}</div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <AisleBadge aisle={item.aisle} side={item.side} zone={item.zone} small isDark={isDark} />
                          <span className="text-xs text-red-600 font-bold">{item.stock} / {item.lowStock}</span>
                        </div>
                      </div>
                      <button onClick={() => onSelectProduct({ name: item.product, aisle: item.aisle, side: item.side, zone: item.zone, image: item.image })} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl font-bold text-xs shadow-md transition-colors shrink-0">
                        Localiser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'adds' && (
        <div>
          <button onClick={onAddProduct} className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg">
            <PackagePlus size={18} />Ajouter un produit
          </button>
          {(!recentAdds || recentAdds.length === 0) ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-3">📦</div>
              <div className={`font-bold text-xl ${t.text} mb-1`}>Aucun ajout</div>
              <div className={`text-sm ${t.textMuted}`}>Vos nouveaux produits apparaîtront ici</div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAdds.map((add, i) => (
                <div key={i} className={`${t.surface} border-2 border-green-200 rounded-2xl p-3 ${t.cardShadow}`}>
                  <div className="flex items-center gap-3">
                    <ProductImage src={add.product.image} alt={add.product.name} size="sm" isDark={isDark} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`font-bold ${t.text} truncate text-sm`}>{add.product.name}</div>
                        <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase">Nouveau</span>
                      </div>
                      {add.product.brand && <div className={`text-xs ${t.textMuted} truncate`}>{add.product.brand}</div>}
                      <div className={`text-[10px] ${t.textMuted} mt-0.5 font-medium`}>{add.timestamp}</div>
                      <div className="mt-1.5">
                        <AisleBadge aisle={add.product.aisle} side={add.product.side} zone={add.product.zone} small isDark={isDark} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'moves' && (
        <div>
          {recentMoves.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-3">🚚</div>
              <div className={`font-bold text-xl ${t.text} mb-1`}>Aucun déplacement</div>
              <div className={`text-sm ${t.textMuted}`}>Allez dans Catalogue pour réorganiser</div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentMoves.map((move, i) => (
                <div key={i} className={`${t.surface} border-2 border-yellow-200 rounded-2xl p-3 ${t.cardShadow}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <ProductImage src={move.product.image} alt={move.product.name} size="sm" isDark={isDark} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold ${t.text} truncate text-sm`}>{move.product.name}</div>
                      <div className={`text-[10px] ${t.textMuted} font-medium`}>{move.timestamp}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 text-xs pt-2 border-t ${t.border}`}>
                    <AisleBadge aisle={move.from.aisle} side={move.from.side} zone={move.from.zone} small isDark={isDark} />
                    <ArrowRight size={14} className="text-yellow-600" />
                    <AisleBadge aisle={move.to.aisle} side={move.to.side} zone={move.to.zone} small isDark={isDark} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label="Catalogue" value={products.length} unit="produits" emoji="📦" theme={theme} />
            <StatCard label="OFF" value="3M+" unit="disponibles" emoji="🌍" theme={theme} />
            <StatCard label="Ajouts" value={recentAdds?.length || 0} unit="cette session" emoji="➕" accent="green" theme={theme} />
            <StatCard label="Déplacements" value={recentMoves.length} unit="cette session" emoji="🚚" accent="yellow" theme={theme} />
            <StatCard label="Alertes" value={lowStockItems.length} unit="critiques" emoji="⚠️" accent="red" theme={theme} />
            <StatCard label="Sections" value={11} unit="+ 9 zones" emoji="🛒" theme={theme} />
          </div>

          <div className={`${t.surface} border-2 ${t.border} rounded-2xl p-4 ${t.cardShadow}`}>
            <div className={`font-bold text-sm ${t.text} mb-3 flex items-center gap-2`}>
              <TrendingUp size={16} className="text-red-600" />Produits par allée
            </div>
            {Object.keys(AISLES).map(num => {
              const n = parseInt(num);
              const count = products.filter(p => p.aisle === n).length;
              const max = Math.max(...Object.keys(AISLES).map(k => products.filter(p => p.aisle === parseInt(k)).length), 1);
              const pct = (count / max) * 100;
              const isNatural = n <= 2;
              return (
                <div key={num} className="flex items-center gap-3 mb-2">
                  <div className={`text-xs font-bold ${t.textSecondary} w-12`}>Allée {n}</div>
                  <div className={`flex-1 h-2 ${isDark ? 'bg-stone-700' : 'bg-stone-100'} rounded-full overflow-hidden`}>
                    <div className={`h-full rounded-full transition-all ${isNatural ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={`text-xs font-bold ${t.textSecondary} w-10 text-right`}>{count}</div>
                </div>
              );
            })}
          </div>

          <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-5 text-white shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-yellow-300" />
                <div className="font-bold text-sm uppercase tracking-wider">Vision produit</div>
              </div>
              <div className="font-bold text-xl mb-3 leading-snug">
                Au-delà d'une carte. Une expérience.
              </div>
              <div className="space-y-1.5 text-sm opacity-95">
                <div className="flex gap-2">✨ Catalogue local 900+ produits québécois</div>
                <div className="flex gap-2">✨ API Open Food Facts (3M+ produits)</div>
                <div className="flex gap-2">✨ Analyse de circulaire par IA (Claude)</div>
                <div className="flex gap-2">✨ Analyse de circulaire par IA (Claude)</div>
                <div className="flex gap-2">✨ Prix, promos, favoris et recettes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'circular' && <CircularAnalyzer products={products} theme={theme} />}
    </div>
  );
};

// ============================================================
// SUGGESTIONS DE RECETTES
// ============================================================
const RecipeSuggestions = ({ cartProducts, products, onAddToList, shoppingList, theme }) => {
  const { t, isDark } = theme;
  const suggestions = useMemo(() => suggestRecipes(cartProducts), [cartProducts]);
  const [expanded, setExpanded] = useState(null);

  if (suggestions.length === 0) return null;

  // Trouve un produit du catalogue correspondant à un ingrédient
  const findProductFor = (ing) => products.find(p => p.name.toLowerCase().includes(ing) || (p.keywords || []).some(k => k.includes(ing)));

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className={`font-bold ${t.text}`}>Recettes pour vous 👨‍🍳</h3>
          <p className={`text-[11px] ${t.textMuted}`}>Basées sur votre panier</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {suggestions.map(recipe => {
          const isOpen = expanded === recipe.id;
          const missing = recipe.ingredients.filter(ing => !recipe.matchedIngredients.includes(ing));
          return (
            <div key={recipe.id} className={`shrink-0 w-64 ${t.surface} border-2 ${t.border} rounded-2xl overflow-hidden ${t.cardShadow}`}>
              <div className="relative h-28 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
                <span className="text-6xl" style={{ lineHeight: 1 }}>{recipe.emoji}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <div className="text-white font-bold text-sm leading-tight">{recipe.name}</div>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">⏱ {recipe.time}</div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✓ {recipe.matchCount} ingrédient{recipe.matchCount > 1 ? 's' : ''} au panier</span>
                </div>
                <button onClick={() => setExpanded(isOpen ? null : recipe.id)} className={`text-xs font-bold ${t.textSecondary} flex items-center gap-1`}>
                  {isOpen ? 'Masquer' : 'Voir les ingrédients'} <ChevronRight size={12} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="mt-2 space-y-1 animate-fade-up">
                    {recipe.ingredients.map(ing => {
                      const have = recipe.matchedIngredients.includes(ing);
                      const prod = !have && findProductFor(ing);
                      const inCart = prod && shoppingList.find(i => i.product.id === prod.id);
                      return (
                        <div key={ing} className="flex items-center justify-between gap-2 text-xs">
                          <span className={`capitalize ${have ? 'text-green-600 font-semibold' : t.textSecondary}`}>{have ? '✓' : '○'} {ing}</span>
                          {prod && !inCart && <button onClick={() => onAddToList(prod)} className="text-red-600 font-bold hover:text-red-700">+ ajouter</button>}
                          {inCart && <span className="text-green-500 font-bold">au panier</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// ANALYSEUR DE CIRCULAIRE IA (Claude intégré)
// ============================================================
const CircularAnalyzer = ({ products, theme }) => {
  const { t, isDark } = theme;
  const [inputMode, setInputMode] = useState('text'); // text | image
  const [circularText, setCircularText] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageName, setImageName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    setError(''); setResult(null);
    if (inputMode === 'text' && !circularText.trim()) { setError('Collez le texte du circulaire d\'abord.'); return; }
    if (inputMode === 'image' && !imageData) { setError('Téléversez une image du circulaire d\'abord.'); return; }
    setAnalyzing(true);

    // Échantillon de notre catalogue pour donner du contexte à l'IA
    const sample = products.filter(p => p.price).slice(0, 60).map(p => `${p.name}`).join('; ');

    const prompt = `Tu es un analyste marketing pour l'épicerie Maxi au Québec. Voici un échantillon de produits de notre catalogue: ${sample}.

Analyse le circulaire Maxi de la semaine fourni et réponds UNIQUEMENT avec un objet JSON valide (aucun texte autour, pas de backticks) avec cette structure exacte:
{
  "store": "Maxi",
  "deals": [{"product": "nom du produit en promo", "price": "prix affiché", "comment": "court commentaire sur l'aubaine (ex: rabais intéressant, format familial, etc.)"}],
  "bestDeals": ["3 meilleures aubaines de la semaine à mettre de l'avant, une phrase chacune"],
  "featured": ["3 suggestions de produits du circulaire à placer en vedette en magasin pour maximiser les ventes"],
  "summary": "résumé en 2 phrases de la stratégie de mise en marché recommandée pour cette semaine"
}
Limite-toi à 6 entrées max dans deals. Réponds en français.`;

    const content = inputMode === 'image'
      ? [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageData } }, { type: 'text', text: prompt + '\n\nLe circulaire est dans l\'image ci-jointe.' }]
      : prompt + '\n\nCIRCULAIRE À ANALYSER:\n' + circularText;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content }]
        })
      });
      const data = await response.json();
      const text = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(text);
      setResult(parsed);
    } catch (err) {
      setError("L'analyse a échoué. Vérifiez le format du circulaire et réessayez.");
    }
    setAnalyzing(false);
  };

  const exampleText = `Maxi - Circulaire de la semaine
Bananes 0,59$/lb
Poitrines de poulet 4,99$/lb (rabais)
Fraises 1lb 2,99$ - 2 pour 5$
Lait 2% 4L 5,49$
Pain tranché 2/5$
Œufs gros douzaine 2,99$
Saumon de l'Atlantique 9,99$/lb
Café moulu 1kg 9,99$
Croustilles format familial 2/7$`;

  return (
    <div className="animate-fade-up">
      <div className="mb-5 p-5 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-yellow-300" />
            <div className="text-xs font-semibold uppercase tracking-wider opacity-90">IA intégrée · Claude</div>
          </div>
          <div className="font-bold text-xl">Analyseur de circulaire</div>
          <div className="text-xs opacity-90 mt-0.5">L'IA analyse votre circulaire et suggère quoi mettre en vedette</div>
        </div>
      </div>

      <div className={`flex gap-1 mb-4 ${isDark ? 'bg-stone-800' : 'bg-stone-100'} p-1 rounded-2xl`}>
        <button onClick={() => setInputMode('text')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${inputMode === 'text' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>📝 Coller le texte</button>
        <button onClick={() => setInputMode('image')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${inputMode === 'image' ? `${t.surface} ${t.text} shadow-sm` : t.textMuted}`}>📷 Téléverser une image</button>
      </div>

      {inputMode === 'text' && (
        <div className="mb-4">
          <textarea value={circularText} onChange={e => setCircularText(e.target.value)} placeholder="Collez ici le texte du circulaire (prix, produits, promos)..." rows={7} className={`w-full ${t.input} px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all text-sm resize-none`} />
          <button onClick={() => setCircularText(exampleText)} className={`mt-2 text-xs ${t.textMuted} font-semibold hover:text-purple-600`}>💡 Insérer un exemple (circulaire Maxi)</button>
        </div>
      )}

      {inputMode === 'image' && (
        <div className="mb-4">
          <label className={`block w-full ${t.surface} border-2 border-dashed ${t.border} rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors`}>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="text-4xl mb-2">📷</div>
            <div className={`font-bold ${t.text} text-sm`}>{imageName || 'Choisir une photo du circulaire'}</div>
            <div className={`text-xs ${t.textMuted} mt-1`}>{imageData ? '✓ Image prête à analyser' : 'JPG, PNG...'}</div>
          </label>
        </div>
      )}

      <button onClick={runAnalysis} disabled={analyzing} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md">
        {analyzing ? <><Loader size={18} className="animate-spin" />Claude analyse le circulaire...</> : <><Sparkles size={18} />Analyser avec l'IA</>}
      </button>

      {error && <div className="mt-3 bg-red-50 border-2 border-red-200 text-red-700 text-sm p-3 rounded-xl font-semibold">{error}</div>}

      {result && (
        <div className="mt-5 space-y-4 animate-fade-up">
          <div className={`p-4 rounded-2xl ${t.surface} border-2 ${t.border} ${t.cardShadow}`}>
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-purple-600" />
              <div className={`font-bold ${t.text}`}>Circulaire analysé : {result.store}</div>
            </div>
            <p className={`text-sm ${t.textSecondary}`}>{result.summary}</p>
          </div>

          {result.deals && result.deals.length > 0 && (
            <div className={`p-4 rounded-2xl ${t.surface} border-2 ${t.border} ${t.cardShadow}`}>
              <div className={`font-bold text-sm ${t.text} mb-3 flex items-center gap-2`}><TrendingUp size={16} className="text-blue-600" />Promos détectées</div>
              <div className="space-y-2">
                {result.deals.map((d, i) => (
                  <div key={i} className={`flex items-start justify-between gap-3 pb-2 ${i < result.deals.length - 1 ? `border-b ${t.border}` : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm ${t.text}`}>{d.product}</div>
                      <div className={`text-xs ${t.textMuted}`}>{d.comment}</div>
                    </div>
                    <div className="font-bold text-sm text-purple-600 shrink-0">{d.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.bestDeals && result.bestDeals.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <div className="font-bold text-sm text-amber-800 mb-2 flex items-center gap-2">⚡ Meilleures aubaines à surveiller</div>
              <div className="space-y-1.5">{result.bestDeals.map((d, i) => <div key={i} className="text-sm text-amber-900 flex gap-2"><span>•</span>{d}</div>)}</div>
            </div>
          )}

          {result.featured && result.featured.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-xl">
              <div className="font-bold text-sm mb-2 flex items-center gap-2"><Sparkles size={16} className="text-yellow-300" />Suggestions IA : à mettre en vedette chez Maxi</div>
              <div className="space-y-1.5">{result.featured.map((f, i) => <div key={i} className="text-sm opacity-95 flex gap-2"><span className="text-yellow-300">★</span>{f}</div>)}</div>
            </div>
          )}
        </div>
      )}

      <div className={`mt-4 p-3 rounded-xl ${t.surfaceAlt} border ${t.border} text-[11px] ${t.textMuted} flex items-start gap-2`}>
        <Sparkles size={14} className="shrink-0 mt-0.5 text-purple-500" />
        <span>Propulsé par Claude. L'analyse du texte/image est réelle. En production : import hebdomadaire automatisé du circulaire Maxi.</span>
      </div>
    </div>
  );
};

// ============================================================
// APPLICATION PRINCIPALE
// ============================================================
export default function StoreFinderApp() {
  const theme = useTheme();
  const { t, isDark, toggle } = theme;
  const [mode, setMode] = useState('customer'); // customer | employee
  const [view, setView] = useState('search'); // search | browse | aisle | zone | map | list
  const [selectedAisle, setSelectedAisle] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [movingProduct, setMovingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recentMoves, setRecentMoves] = useState([]);
  const [recentAdds, setRecentAdds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const toggleFavorite = (productId) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const addToList = (product) => {
    if (shoppingList.find(i => i.product.id === product.id)) return;
    setShoppingList(prev => [...prev, { product, checked: false }]);
  };
  const removeFromList = (item) => setShoppingList(prev => prev.filter(i => i !== item));
  const toggleItem = (item) => setShoppingList(prev => prev.map(i => i === item ? { ...i, checked: !i.checked } : i));
  const clearList = () => setShoppingList([]);

  const selectProduct = (product) => {
    setHighlightedProduct(product);
    if (product.aisle === 0) { setSelectedZone(product.zone); setSelectedAisle(null); }
    else { setSelectedAisle(product.aisle); setSelectedZone(null); }
    setMode('customer');
    setView('map');
  };

  const handleMove = (product, dest) => {
    const timestamp = new Date().toLocaleString('fr-CA', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
    setRecentMoves(prev => [{
      product,
      from: { aisle: product.aisle, side: product.side, zone: product.zone },
      to: dest,
      timestamp
    }, ...prev]);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...dest } : p));
  };

  const handleAddProduct = (newProduct) => {
    const timestamp = new Date().toLocaleString('fr-CA', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
    setProducts(prev => [newProduct, ...prev]);
    setRecentAdds(prev => [{ product: newProduct, timestamp }, ...prev]);
  };

  const NavBtn = ({ id, icon: Icon, label, badge }) => {
    const active = view === id;
    return (
      <button onClick={() => { setView(id); if (id === 'map') setHighlightedProduct(null); }} className={`relative flex-1 flex flex-col items-center gap-1 py-2 transition-all ${active ? 'text-red-600' : t.textMuted}`}>
        <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-red-100' : ''}`}>
          <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? 'text-red-600' : ''} />
          {badge > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span>
          )}
        </div>
        <span className={`text-[10px] font-bold ${active ? 'text-red-600' : ''}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className={`${isDark ? 'dark' : ''} font-sans min-h-screen ${t.bgGradient} doodle-bg`}>
      {FONTS_LINK}
      <style>{STYLES}</style>

      {/* ÉCRAN D'ACCUEIL */}
      {showWelcome && (
        <div className={`fixed inset-0 z-[60] ${t.bgGradient} flex flex-col animate-fade-up overflow-y-auto`}>
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
            {/* Logo géant */}
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                <ShoppingCart size={48} strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart size={20} className="text-red-600 fill-red-600" />
              </div>
            </div>
            <h1 className={`font-bold text-4xl ${t.text} text-center leading-tight`}>Mon Magasin</h1>
            <p className="font-hand text-2xl text-red-600 mt-1 mb-2">trouvez tout, facilement</p>
            <p className={`text-center ${t.textSecondary} text-sm mb-8 max-w-xs`}>
              L'application qui guide vos clients en magasin et outille vos employés au quotidien.
            </p>

            {/* Bénéfices clés — cliquables */}
            <div className="w-full space-y-3 mb-8">
              {[
                { emoji: '🔍', title: 'Trouvez en quelques secondes', desc: 'Cherchez un produit, voyez exactement où il se trouve', action: () => { setShowWelcome(false); setMode('customer'); setView('search'); } },
                { emoji: '🗺️', title: 'Parcours optimisé', desc: 'Le chemin le plus court pour toute votre liste', action: () => { setShowWelcome(false); setMode('customer'); setView('list'); } },
                { emoji: '✨', title: 'Outils employés + IA', desc: 'Gestion des stocks et analyse du circulaire', action: () => { setShowWelcome(false); setMode('employee'); } }
              ].map((b, i) => (
                <button key={i} onClick={b.action} className={`group w-full flex items-center gap-4 p-4 rounded-2xl ${t.surface} border-2 ${t.border} ${t.cardShadow} hover:border-red-300 hover:scale-[1.01] transition-all text-left`}>
                  <div className="text-3xl">{b.emoji}</div>
                  <div className="flex-1">
                    <div className={`font-bold ${t.text} text-sm`}>{b.title}</div>
                    <div className={`text-xs ${t.textMuted}`}>{b.desc}</div>
                  </div>
                  <ChevronRight size={18} className={`${t.textMuted} group-hover:text-red-600 group-hover:translate-x-0.5 transition-all`} />
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">{products.length}</div>
                <div className={`text-[10px] ${t.textMuted} font-semibold uppercase tracking-wide`}>Produits</div>
              </div>
              <div className={`w-px h-8 ${t.border} border-l`}></div>
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">11</div>
                <div className={`text-[10px] ${t.textMuted} font-semibold uppercase tracking-wide`}>Allées</div>
              </div>
              <div className={`w-px h-8 ${t.border} border-l`}></div>
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">9</div>
                <div className={`text-[10px] ${t.textMuted} font-semibold uppercase tracking-wide`}>Sections</div>
              </div>
            </div>

            <button onClick={() => setShowWelcome(false)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg text-lg">
              Commencer <ArrowRight size={20} />
            </button>
            <button onClick={() => { setShowWelcome(false); setMode('employee'); }} className={`mt-3 text-sm ${t.textMuted} font-semibold hover:text-red-600 flex items-center gap-1.5`}>
              <Briefcase size={14} /> Accéder à l'espace employé
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 ${t.headerBg} backdrop-blur-md border-b ${t.border}`}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Logo isDark={isDark} />
          <div className="flex items-center gap-2">
            <button onClick={toggle} className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-stone-800 text-yellow-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`} title="Changer le thème">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className={`flex ${isDark ? 'bg-stone-800' : 'bg-stone-100'} p-1 rounded-xl`}>
              <button onClick={() => { setMode('customer'); setView('search'); }} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${mode === 'customer' ? 'bg-red-600 text-white shadow-sm' : t.textMuted}`}>
                <User size={13} />Client
              </button>
              <button onClick={() => setMode('employee')} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${mode === 'employee' ? 'bg-stone-800 text-white shadow-sm' : t.textMuted}`}>
                <Briefcase size={13} />Employé
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <main className={`max-w-md mx-auto px-4 py-5 ${mode === 'customer' ? 'pb-24' : 'pb-10'}`}>
        {mode === 'customer' && (
          <>
            {view === 'search' && (
              <div>
                <div className="mb-5">
                  <h1 className={`font-bold text-3xl ${t.text} leading-tight`}>Trouvez tout 🛒</h1>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Cherchez un produit, on vous montre où il est</p>
                </div>
                <ProductSearch products={products} onSelectProduct={selectProduct} onAddToList={addToList} shoppingList={shoppingList} favorites={favorites} onToggleFavorite={toggleFavorite} theme={theme} />
              </div>
            )}
            {view === 'browse' && (
              <BrowseCategories
                products={products}
                onSelectAisle={(n) => { setSelectedAisle(n); setView('aisle'); }}
                onSelectZone={(z) => { setSelectedZone(z); setView('zone'); }}
                theme={theme}
              />
            )}
            {view === 'aisle' && selectedAisle && (
              <AisleDetail aisleNum={selectedAisle} products={products} onBack={() => setView('browse')} theme={theme} />
            )}
            {view === 'zone' && selectedZone && (
              <ZoneDetail zoneKey={selectedZone} products={products} onBack={() => setView('browse')} theme={theme} />
            )}
            {view === 'map' && (
              <div>
                <div className="mb-4">
                  <h1 className={`font-bold text-2xl ${t.text}`}>Plan du magasin 🗺️</h1>
                  <p className={`text-sm ${t.textMuted} mt-0.5`}>
                    {highlightedProduct ? `Emplacement de « ${highlightedProduct.name} »` : 'Tout le magasin d\'un coup d\'œil'}
                  </p>
                </div>
                {highlightedProduct && (
                  <div className={`mb-4 p-3 rounded-2xl ${t.surface} border-2 border-red-200 flex items-center gap-3 ${t.cardShadow}`}>
                    <ProductImage src={highlightedProduct.image} alt={highlightedProduct.name} isDark={isDark} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold ${t.text} truncate`}>{highlightedProduct.name}</div>
                      {highlightedProduct.brand && <div className={`text-xs ${t.textMuted} truncate`}>{highlightedProduct.brand}</div>}
                      <div className="mt-1.5">
                        <AisleBadge aisle={highlightedProduct.aisle} side={highlightedProduct.side} zone={highlightedProduct.zone} small isDark={isDark} />
                      </div>
                    </div>
                    {highlightedProduct.aisle !== undefined && !shoppingList.find(i => i.product.id === highlightedProduct.id) && (
                      <button onClick={() => addToList(highlightedProduct)} className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl shadow-md transition-colors shrink-0" title="Ajouter à ma liste">
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                )}
                <StoreMap
                  highlightAisle={highlightedProduct && highlightedProduct.aisle > 0 ? highlightedProduct.aisle : (selectedAisle || null)}
                  highlightZone={highlightedProduct && highlightedProduct.aisle === 0 ? highlightedProduct.zone : (selectedZone || null)}
                  theme={theme}
                />
              </div>
            )}
            {view === 'list' && (
              <div>
                <RecipeSuggestions cartProducts={shoppingList.map(i => i.product)} products={products} onAddToList={addToList} shoppingList={shoppingList} theme={theme} />
                <ShoppingList list={shoppingList} onRemove={removeFromList} onToggle={toggleItem} onClear={clearList} theme={theme} />
              </div>
            )}
          </>
        )}

        {mode === 'employee' && (
          <EmployeeMode
            products={products}
            onSelectProduct={selectProduct}
            onMoveProduct={(p) => setMovingProduct(p)}
            onAddProduct={() => setShowAddModal(true)}
            recentMoves={recentMoves}
            recentAdds={recentAdds}
            theme={theme}
          />
        )}
      </main>

      {/* NAV BAS (client seulement) */}
      {mode === 'customer' && (
        <nav className={`fixed bottom-0 left-0 right-0 z-40 ${t.navBg} backdrop-blur-md border-t ${t.border}`}>
          <div className="max-w-md mx-auto px-2 flex items-center">
            <NavBtn id="search" icon={Search} label="Chercher" />
            <NavBtn id="browse" icon={Package} label="Allées" />
            <NavBtn id="list" icon={ShoppingCart} label="Panier" badge={shoppingList.length} />
            <NavBtn id="map" icon={MapPin} label="Plan" />
          </div>
        </nav>
      )}

      {/* MODALES */}
      {movingProduct && (
        <MoveProductModal
          product={movingProduct}
          onClose={() => setMovingProduct(null)}
          onMove={(dest) => handleMove(movingProduct, dest)}
          theme={theme}
        />
      )}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} theme={theme} />
      )}
    </div>
  );
}
