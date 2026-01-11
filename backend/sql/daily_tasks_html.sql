-- HTML Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('HTML', 'beginner', 'Create a basic HTML page with doctype, html, head, and body tags.', 'Start with <!DOCTYPE html>', 10),
('HTML', 'beginner', 'Add a heading (h1) and a paragraph (p) to your page.', 'Use <h1> for main heading', 10),
('HTML', 'beginner', 'Create an unordered list with 5 items.', 'Use <ul> with <li> items inside', 10),
('HTML', 'beginner', 'Add an image with alt text to your page.', 'Use <img src="" alt="">', 10),
('HTML', 'beginner', 'Create a hyperlink that opens in a new tab.', 'Use target="_blank" attribute', 10),
('HTML', 'beginner', 'Build a simple form with name and email inputs.', 'Use <form>, <input>, and <label> tags', 10),
('HTML', 'beginner', 'Add a table with 3 rows and 3 columns.', 'Use <table>, <tr>, <th>, <td>', 10),
('HTML', 'beginner', 'Create a div container with a paragraph inside.', 'Div is a generic container element', 10),
('HTML', 'beginner', 'Add a button element that says "Click Me".', 'Use <button>Click Me</button>', 10),
('HTML', 'beginner', 'Create a page with header, main, and footer sections.', 'Use semantic tags <header>, <main>, <footer>', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('HTML', 'intermediate', 'Create a form with validation using required and pattern attributes.', 'Use pattern for regex validation', 20),
('HTML', 'intermediate', 'Build a navigation menu using nav and ul elements.', 'Wrap links in <nav> for semantics', 20),
('HTML', 'intermediate', 'Add a video element with controls and fallback text.', 'Use <video controls><source src=""></video>', 20),
('HTML', 'intermediate', 'Create an accessible form with proper labels and ARIA attributes.', 'Use for attribute to link labels to inputs', 20),
('HTML', 'intermediate', 'Build a card component using article, header, and section.', 'Article represents independent content', 20),
('HTML', 'intermediate', 'Create a details and summary element for collapsible content.', 'Details creates expandable sections', 20),
('HTML', 'intermediate', 'Add a figure with an image and figcaption.', 'Figure wraps self-contained content', 20),
('HTML', 'intermediate', 'Create a multi-step form using fieldset and legend.', 'Fieldset groups related form controls', 20),
('HTML', 'intermediate', 'Build a progress bar using the progress element.', 'Use <progress value="50" max="100">', 20),
('HTML', 'intermediate', 'Create a responsive image using srcset and sizes attributes.', 'Srcset provides different image sizes', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('HTML', 'advanced', 'Create a custom data attribute system for a component.', 'Use data-* attributes for custom data', 30),
('HTML', 'advanced', 'Build a form with custom validation messages using setCustomValidity.', 'Use JavaScript with HTML5 validation API', 30),
('HTML', 'advanced', 'Create an accessible modal dialog using proper ARIA roles.', 'Use role="dialog" and aria-modal="true"', 30),
('HTML', 'advanced', 'Implement a skip navigation link for accessibility.', 'Hidden link that becomes visible on focus', 30),
('HTML', 'advanced', 'Create a content editable rich text area.', 'Use contenteditable="true" attribute', 30),
('HTML', 'advanced', 'Build a live region for screen reader announcements.', 'Use aria-live="polite" or "assertive"', 30),
('HTML', 'advanced', 'Create a custom autocomplete using datalist.', 'Datalist provides input suggestions', 30),
('HTML', 'advanced', 'Implement lazy loading for images and iframes.', 'Use loading="lazy" attribute', 30),
('HTML', 'advanced', 'Create a print-optimized page with proper meta tags.', 'Use media="print" for print stylesheets', 30),
('HTML', 'advanced', 'Build a fully accessible tab interface with ARIA.', 'Use role="tablist", "tab", and "tabpanel"', 30);
