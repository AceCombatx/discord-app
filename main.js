// Main JavaScript for the Discord Application Portal
// This file handles general functionality for the landing page

document.addEventListener('DOMContentLoaded', () => {
  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .hero-content, .floating-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animate');
      }
    });
  };
  
  // Add animation class
  document.querySelectorAll('.feature-card, .hero-content, .floating-card').forEach(el => {
    el.classList.add('fade-in');
  });
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Trigger once on load
  animateOnScroll();
  
  // Handle navigation highlighting
  const navLinks = document.querySelectorAll('nav ul li a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only for hash links
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Add parallax effect to floating cards
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    cards.forEach(card => {
      const cardIndex = card.classList.contains('card-1') ? 1 : 2;
      const strength = cardIndex === 1 ? 20 : 15;
      
      card.style.transform = `translateX(${mouseX * strength}px) translateY(${mouseY * strength}px) rotate(${mouseX * 5}deg)`;
    });
  });
});