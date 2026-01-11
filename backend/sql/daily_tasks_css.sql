-- CSS Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('CSS', 'beginner', 'Change the background color of a div to blue.', 'Use background-color property', 10),
('CSS', 'beginner', 'Set the font size of a paragraph to 18px.', 'Use font-size: 18px', 10),
('CSS', 'beginner', 'Add padding and margin to a button.', 'Padding is inside, margin is outside', 10),
('CSS', 'beginner', 'Create a class that makes text bold and red.', 'Use font-weight and color properties', 10),
('CSS', 'beginner', 'Center text inside a heading element.', 'Use text-align: center', 10),
('CSS', 'beginner', 'Add a border around an image.', 'Use border: 2px solid color', 10),
('CSS', 'beginner', 'Change the width and height of a div.', 'Use width and height properties', 10),
('CSS', 'beginner', 'Apply a hover effect that changes background color.', 'Use selector:hover { }', 10),
('CSS', 'beginner', 'Remove the underline from links.', 'Use text-decoration: none', 10),
('CSS', 'beginner', 'Set a background image on the body.', 'Use background-image: url()', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('CSS', 'intermediate', 'Create a flexbox container that centers its children.', 'Use display: flex with justify-content and align-items', 20),
('CSS', 'intermediate', 'Build a two-column layout using CSS Grid.', 'Use display: grid with grid-template-columns', 20),
('CSS', 'intermediate', 'Add a smooth transition effect to a button hover.', 'Use transition property with duration', 20),
('CSS', 'intermediate', 'Create a responsive design using media queries.', 'Use @media (max-width: 768px) { }', 20),
('CSS', 'intermediate', 'Position an element absolutely within its parent.', 'Parent needs position: relative', 20),
('CSS', 'intermediate', 'Create a gradient background.', 'Use linear-gradient or radial-gradient', 20),
('CSS', 'intermediate', 'Add a box shadow to a card component.', 'Use box-shadow property', 20),
('CSS', 'intermediate', 'Create a navigation bar that sticks to the top.', 'Use position: sticky or fixed', 20),
('CSS', 'intermediate', 'Build a CSS-only dropdown menu.', 'Use :hover on parent to show child', 20),
('CSS', 'intermediate', 'Create custom CSS variables and use them.', 'Define with --name, use with var(--name)', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('CSS', 'advanced', 'Create a CSS animation for a loading spinner.', 'Use @keyframes with transform: rotate', 30),
('CSS', 'advanced', 'Build a responsive grid that changes columns based on screen size.', 'Use minmax() with auto-fit or auto-fill', 30),
('CSS', 'advanced', 'Implement a dark mode theme using CSS custom properties.', 'Switch variables based on class or attribute', 30),
('CSS', 'advanced', 'Create a perspective 3D card flip effect.', 'Use transform-style: preserve-3d and rotateY', 30),
('CSS', 'advanced', 'Build a masonry layout using CSS Grid.', 'Use grid-row spanning for different heights', 30),
('CSS', 'advanced', 'Create a clip-path animation for revealing content.', 'Animate clip-path property', 30),
('CSS', 'advanced', 'Implement scroll-snap for a carousel.', 'Use scroll-snap-type and scroll-snap-align', 30),
('CSS', 'advanced', 'Create a glassmorphism effect.', 'Use backdrop-filter: blur with transparency', 30),
('CSS', 'advanced', 'Build a CSS-only toggle switch.', 'Use checkbox with :checked pseudo-class', 30),
('CSS', 'advanced', 'Create complex shapes using clip-path polygon.', 'Define points as percentage coordinates', 30);
