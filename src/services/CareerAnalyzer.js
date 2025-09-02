class CareerAnalyzer {
  constructor() {
    this.careerPaths = this.initializeCareerPaths();
    this.skillsDatabase = this.initializeSkillsDatabase();
  }

  initializeCareerPaths() {
    return {
      'software-engineer': {
        name: 'Software Engineer',
        description: 'Design, develop, and maintain software applications',
        market_demand: 'Very High',
        estimated_salary_range: '$80,000 - $160,000',
        required_skills: {
          must_have: ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
          good_to_have: ['System Design', 'DevOps', 'Cloud Platforms', 'Agile Methodologies']
        },
        growth_rate: '22%',
        industries: ['Technology', 'Finance', 'Healthcare', 'E-commerce']
      },
      'data-scientist': {
        name: 'Data Scientist',
        description: 'Extract insights from data to drive business decisions',
        market_demand: 'High',
        estimated_salary_range: '$95,000 - $165,000',
        required_skills: {
          must_have: ['Python/R', 'Statistics', 'SQL', 'Machine Learning'],
          good_to_have: ['Deep Learning', 'Big Data Tools', 'Data Visualization', 'Domain Expertise']
        },
        growth_rate: '31%',
        industries: ['Technology', 'Healthcare', 'Finance', 'Retail']
      },
      'product-manager': {
        name: 'Product Manager',
        description: 'Guide product development from conception to launch',
        market_demand: 'High',
        estimated_salary_range: '$100,000 - $180,000',
        required_skills: {
          must_have: ['Strategic Thinking', 'User Research', 'Data Analysis', 'Communication'],
          good_to_have: ['Technical Knowledge', 'Design Thinking', 'A/B Testing', 'Roadmap Planning']
        },
        growth_rate: '19%',
        industries: ['Technology', 'E-commerce', 'SaaS', 'Mobile Apps']
      },
      'cybersecurity-analyst': {
        name: 'Cybersecurity Analyst',
        description: 'Protect organizations from cyber threats and vulnerabilities',
        market_demand: 'Very High',
        estimated_salary_range: '$85,000 - $140,000',
        required_skills: {
          must_have: ['Network Security', 'Incident Response', 'Risk Assessment', 'Compliance'],
          good_to_have: ['Penetration Testing', 'Forensics', 'Cloud Security', 'Threat Intelligence']
        },
        growth_rate: '33%',
        industries: ['Government', 'Finance', 'Healthcare', 'Technology']
      },
      'cloud-architect': {
        name: 'Cloud Solutions Architect',
        description: 'Design and implement cloud infrastructure solutions',
        market_demand: 'Very High',
        estimated_salary_range: '$120,000 - $200,000',
        required_skills: {
          must_have: ['Cloud Platforms', 'System Architecture', 'Networking', 'Security'],
          good_to_have: ['DevOps', 'Containers', 'Serverless', 'Cost Optimization']
        },
        growth_rate: '25%',
        industries: ['Technology', 'Consulting', 'Enterprise', 'Startups']
      }
    };
  }

  initializeSkillsDatabase() {
    return {
      'programming': ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust'],
      'web-development': ['React', 'Vue.js', 'Angular', 'Node.js', 'HTML/CSS'],
      'data-science': ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
      'cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
      'databases': ['SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      'devops': ['CI/CD', 'Jenkins', 'Terraform', 'Ansible', 'Monitoring']
    };
  }

  async generateRecommendations(userProfile, query, ragContext) {
    try {
      const userSkills = this.extractSkills(userProfile);
      const careerMatches = this.findCareerMatches(userProfile, userSkills);
      
      const recommendations = careerMatches.slice(0, 3).map(match => {
        const career = this.careerPaths[match.careerKey];
        const skillGap = this.analyzeSkillGap(userSkills, career.required_skills);
        const learningResources = this.generateLearningResources(skillGap.missing, career.name);
        const roadmap = this.generateRoadmap(skillGap.missing, career.name);
        
        return {
          career_name: career.name,
          reasoning: this.generateReasoning(userProfile, career, match.score, ragContext),
          market_demand: career.market_demand,
          estimated_salary_range: career.estimated_salary_range,
          required_skills: career.required_skills,
          learning_resources: learningResources,
          roadmap: roadmap
        };
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  extractSkills(userProfile) {
    const skills = new Set();
    
    // Extract from skills array
    if (userProfile.skills && Array.isArray(userProfile.skills)) {
      userProfile.skills.forEach(skill => skills.add(skill.toLowerCase()));
    }
    
    // Extract from experience descriptions
    if (userProfile.experience && Array.isArray(userProfile.experience)) {
      userProfile.experience.forEach(exp => {
        if (exp.description) {
          this.extractSkillsFromText(exp.description).forEach(skill => skills.add(skill));
        }
      });
    }
    
    // Extract from education
    if (userProfile.education && Array.isArray(userProfile.education)) {
      userProfile.education.forEach(edu => {
        if (edu.field) {
          this.extractSkillsFromText(edu.field).forEach(skill => skills.add(skill));
        }
      });
    }
    
    return Array.from(skills);
  }

  extractSkillsFromText(text) {
    const skills = new Set();
    const textLower = text.toLowerCase();
    
    // Check against known skills
    Object.values(this.skillsDatabase).flat().forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        skills.add(skill.toLowerCase());
      }
    });
    
    return Array.from(skills);
  }

  findCareerMatches(userProfile, userSkills) {
    const matches = [];
    
    Object.entries(this.careerPaths).forEach(([key, career]) => {
      let score = 0;
      
      // Skill matching
      const allRequiredSkills = [
        ...career.required_skills.must_have,
        ...career.required_skills.good_to_have
      ].map(skill => skill.toLowerCase());
      
      const matchingSkills = userSkills.filter(userSkill => 
        allRequiredSkills.some(reqSkill => 
          reqSkill.includes(userSkill) || userSkill.includes(reqSkill)
        )
      );
      
      score += matchingSkills.length * 10;
      
      // Experience level matching
      if (userProfile.experience_level) {
        const expLevel = userProfile.experience_level.toLowerCase();
        if (expLevel.includes('senior') || expLevel.includes('lead')) {
          score += 5;
        }
      }
      
      // Industry matching
      if (userProfile.preferred_industries && career.industries) {
        const industryMatches = userProfile.preferred_industries.filter(industry =>
          career.industries.some(careerIndustry => 
            careerIndustry.toLowerCase().includes(industry.toLowerCase())
          )
        );
        score += industryMatches.length * 8;
      }
      
      matches.push({ careerKey: key, score, matchingSkills });
    });
    
    return matches.sort((a, b) => b.score - a.score);
  }

  analyzeSkillGap(userSkills, requiredSkills) {
    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
    
    const mustHaveMissing = requiredSkills.must_have.filter(skill =>
      !userSkillsLower.some(userSkill => 
        skill.toLowerCase().includes(userSkill) || userSkill.includes(skill.toLowerCase())
      )
    );
    
    const goodToHaveMissing = requiredSkills.good_to_have.filter(skill =>
      !userSkillsLower.some(userSkill => 
        skill.toLowerCase().includes(userSkill) || userSkill.includes(skill.toLowerCase())
      )
    );
    
    return {
      missing: [...mustHaveMissing, ...goodToHaveMissing],
      mustHaveMissing,
      goodToHaveMissing
    };
  }

  generateLearningResources(missingSkills, careerName) {
    const resources = [];
    
    missingSkills.slice(0, 4).forEach(skill => {
      const resource = this.getResourceForSkill(skill, careerName);
      if (resource) {
        resources.push(resource);
      }
    });
    
    return resources;
  }

  getResourceForSkill(skill, careerName) {
    const skillLower = skill.toLowerCase();
    
    // Mock learning resources - in production, this would be a comprehensive database
    const resourceMap = {
      'python': {
        platform: 'Coursera',
        course_name: 'Python for Everybody Specialization',
        link: 'https://www.coursera.org/specializations/python',
        duration: '8 months'
      },
      'javascript': {
        platform: 'freeCodeCamp',
        course_name: 'JavaScript Algorithms and Data Structures',
        link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        duration: '300 hours'
      },
      'react': {
        platform: 'React.dev',
        course_name: 'React Official Tutorial',
        link: 'https://react.dev/learn',
        duration: '2-3 weeks'
      },
      'aws': {
        platform: 'AWS Skill Builder',
        course_name: 'AWS Cloud Practitioner Essentials',
        link: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
        duration: '6 hours'
      },
      'machine learning': {
        platform: 'Coursera',
        course_name: 'Machine Learning Specialization',
        link: 'https://www.coursera.org/specializations/machine-learning-introduction',
        duration: '3 months'
      }
    };
    
    // Find matching resource
    for (const [key, resource] of Object.entries(resourceMap)) {
      if (skillLower.includes(key) || key.includes(skillLower)) {
        return resource;
      }
    }
    
    // Default resource
    return {
      platform: 'LinkedIn Learning',
      course_name: `${skill} Fundamentals`,
      link: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(skill)}`,
      duration: '2-4 weeks'
    };
  }

  generateRoadmap(missingSkills, careerName) {
    const roadmap = {
      '30_days': [],
      '60_days': [],
      '90_days': []
    };
    
    // Prioritize skills
    const prioritizedSkills = this.prioritizeSkills(missingSkills);
    
    // 30 days - Foundation skills
    if (prioritizedSkills.length > 0) {
      roadmap['30_days'] = [
        `Start learning ${prioritizedSkills[0]}`,
        'Complete basic tutorials and exercises',
        'Build a simple project using the new skill',
        'Join relevant online communities'
      ];
    }
    
    // 60 days - Intermediate skills
    if (prioritizedSkills.length > 1) {
      roadmap['60_days'] = [
        `Continue advancing in ${prioritizedSkills[0]}`,
        `Begin learning ${prioritizedSkills[1]}`,
        'Work on a more complex project',
        'Start building a portfolio'
      ];
    }
    
    // 90 days - Advanced and specialization
    roadmap['90_days'] = [
      'Complete advanced courses in core skills',
      'Contribute to open source projects',
      'Network with professionals in the field',
      'Apply for relevant positions or freelance work'
    ];
    
    return roadmap;
  }

  prioritizeSkills(skills) {
    // Simple prioritization - in production, this would be more sophisticated
    const priority = {
      'programming': 10,
      'python': 9,
      'javascript': 9,
      'sql': 8,
      'react': 7,
      'aws': 7,
      'machine learning': 6
    };
    
    return skills.sort((a, b) => {
      const aPriority = priority[a.toLowerCase()] || 5;
      const bPriority = priority[b.toLowerCase()] || 5;
      return bPriority - aPriority;
    });
  }

  generateReasoning(userProfile, career, matchScore, ragContext) {
    let reasoning = `Based on your profile, ${career.name} is a strong match because `;
    
    // Add skill-based reasoning
    if (matchScore > 50) {
      reasoning += 'you already have many of the required skills. ';
    } else if (matchScore > 20) {
      reasoning += 'you have some foundational skills that align well. ';
    } else {
      reasoning += 'this field offers excellent growth opportunities. ';
    }
    
    // Add market demand reasoning
    reasoning += `The market demand is ${career.market_demand.toLowerCase()}, `;
    reasoning += `with a projected growth rate of ${career.growth_rate}. `;
    
    // Add context from RAG if available
    if (ragContext.length > 0) {
      const relevantContext = ragContext.find(ctx => 
        ctx.content.toLowerCase().includes(career.name.toLowerCase())
      );
      if (relevantContext) {
        reasoning += `Industry insights suggest ${relevantContext.content.split('.')[0].toLowerCase()}.`;
      }
    }
    
    return reasoning;
  }
}

module.exports = CareerAnalyzer;