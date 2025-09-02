class KnowledgeBase {
  constructor() {
    // In production, this would connect to a vector database like Pinecone, Weaviate, or Chroma
    // For now, we'll use a simple in-memory knowledge base with mock data
    this.knowledge = this.initializeKnowledgeBase();
  }

  initializeKnowledgeBase() {
    return [
      {
        id: 'aws-cloud-architect',
        content: 'AWS Solutions Architect certification requires knowledge of compute, storage, networking, and database services. Average salary ranges from $120k-180k. High demand in cloud migration projects.',
        source: 'AWS Skill Builder',
        category: 'certification',
        skills: ['aws', 'cloud', 'architecture', 'devops'],
        embedding: null // In production, this would be a vector embedding
      },
      {
        id: 'react-developer',
        content: 'React developers need proficiency in JavaScript ES6+, JSX, hooks, state management (Redux/Context), and modern build tools. Entry level: $70k-90k, Senior: $120k-150k.',
        source: 'LinkedIn Learning',
        category: 'technology',
        skills: ['react', 'javascript', 'frontend', 'web development'],
        embedding: null
      },
      {
        id: 'data-scientist-path',
        content: 'Data Science career path: Python/R programming, statistics, machine learning, SQL, data visualization. Growing field with 22% job growth projected. Salary: $95k-160k.',
        source: 'Coursera Career Guide',
        category: 'career_path',
        skills: ['python', 'machine learning', 'statistics', 'sql', 'data analysis'],
        embedding: null
      },
      {
        id: 'cybersecurity-analyst',
        content: 'Cybersecurity analysts need knowledge of network security, incident response, risk assessment, and compliance frameworks like NIST. CompTIA Security+ is entry-level certification.',
        source: 'CompTIA Learning',
        category: 'cybersecurity',
        skills: ['security', 'networking', 'compliance', 'risk management'],
        embedding: null
      },
      {
        id: 'product-manager-skills',
        content: 'Product managers need strategic thinking, user research, data analysis, roadmap planning, and stakeholder communication. No specific degree required but business/tech background helps.',
        source: 'Product School',
        category: 'product_management',
        skills: ['strategy', 'analytics', 'communication', 'user research'],
        embedding: null
      },
      {
        id: 'devops-engineer',
        content: 'DevOps engineers work with CI/CD pipelines, containerization (Docker/Kubernetes), infrastructure as code, monitoring, and cloud platforms. Salary: $100k-140k.',
        source: 'DevOps Institute',
        category: 'devops',
        skills: ['docker', 'kubernetes', 'ci/cd', 'terraform', 'monitoring'],
        embedding: null
      }
    ];
  }

  async search(query, limit = 3) {
    // Simple keyword-based search
    // In production, this would use vector similarity search
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(' ').filter(word => word.length > 2);
    
    const scored = this.knowledge.map(item => {
      let score = 0;
      
      // Check content match
      keywords.forEach(keyword => {
        if (item.content.toLowerCase().includes(keyword)) score += 2;
        if (item.category.toLowerCase().includes(keyword)) score += 3;
        if (item.skills.some(skill => skill.toLowerCase().includes(keyword))) score += 4;
      });
      
      return { ...item, score };
    });
    
    // Return top matches
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async searchBySkills(skills, limit = 5) {
    const skillsLower = skills.map(skill => skill.toLowerCase());
    
    const scored = this.knowledge.map(item => {
      let score = 0;
      
      skillsLower.forEach(skill => {
        if (item.skills.some(itemSkill => itemSkill.toLowerCase().includes(skill))) {
          score += 3;
        }
        if (item.content.toLowerCase().includes(skill)) {
          score += 1;
        }
      });
      
      return { ...item, score };
    });
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async searchByCategory(category, limit = 5) {
    return this.knowledge
      .filter(item => item.category === category)
      .slice(0, limit);
  }

  getCategories() {
    return [...new Set(this.knowledge.map(item => item.category))];
  }

  getAllSkills() {
    const allSkills = new Set();
    this.knowledge.forEach(item => {
      item.skills.forEach(skill => allSkills.add(skill));
    });
    return Array.from(allSkills);
  }

  // Method to add new knowledge (for future expansion)
  addKnowledge(item) {
    const newItem = {
      id: item.id || `knowledge-${Date.now()}`,
      content: item.content,
      source: item.source,
      category: item.category,
      skills: item.skills || [],
      embedding: null
    };
    
    this.knowledge.push(newItem);
    return newItem;
  }
}

module.exports = KnowledgeBase;