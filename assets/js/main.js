// AWS GenAI Well-Architected Labs JavaScript

class LabPlatform {
    constructor() {
        this.currentLab = null;
        this.labData = this.initializeLabData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeContent();
    }

    bindEvents() {
        // Pillar toggle functionality
        document.querySelectorAll('.pillar-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.togglePillar(e.currentTarget);
            });
        });

        // Lab link functionality
        document.querySelectorAll('.lab-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const labId = e.currentTarget.dataset.lab;
                this.loadLab(labId);
            });
        });
        
        // Home link functionality
        document.querySelectorAll('.home-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWelcomeContent();
            });
        });
    }

    togglePillar(toggle) {
        const pillar = toggle.dataset.pillar;
        const content = document.getElementById(`${pillar}-labs`);
        const isActive = toggle.classList.contains('active');

        // Close all other pillars
        document.querySelectorAll('.pillar-toggle').forEach(t => {
            if (t !== toggle) {
                t.classList.remove('active');
                const otherContent = document.getElementById(`${t.dataset.pillar}-labs`);
                if (otherContent) {
                    otherContent.classList.add('hidden');
                }
            }
        });

        // Toggle current pillar
        if (isActive) {
            toggle.classList.remove('active');
            content.classList.add('hidden');
        } else {
            toggle.classList.add('active');
            content.classList.remove('hidden');
        }
    }

    loadLab(labId) {
        const lab = this.labData[labId];
        if (!lab) {
            console.error(`Lab ${labId} not found`);
            return;
        }

        this.currentLab = labId;
        this.updateActiveLabLink(labId);
        this.showLabContent(lab);
    }

    updateActiveLabLink(labId) {
        // Remove active class from all lab links
        document.querySelectorAll('.lab-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current lab link
        const currentLink = document.querySelector(`[data-lab="${labId}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    showWelcomeContent() {
        document.getElementById('welcome-content').classList.remove('hidden');
        document.getElementById('lab-content').classList.add('hidden');
        
        // Clear active lab links
        document.querySelectorAll('.lab-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Close all pillars
        document.querySelectorAll('.pillar-toggle').forEach(toggle => {
            toggle.classList.remove('active');
            const content = document.getElementById(`${toggle.dataset.pillar}-labs`);
            if (content) {
                content.classList.add('hidden');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    showLabContent(lab) {
        // Hide welcome content and show lab content
        document.getElementById('welcome-content').classList.add('hidden');
        document.getElementById('lab-content').classList.remove('hidden');

        // Update lab content
        document.getElementById('breadcrumb').textContent = `首页 > ${lab.pillar} > ${lab.title}`;
        document.getElementById('lab-title').textContent = lab.title;
        document.getElementById('lab-duration').textContent = `预计时间: ${lab.duration}`;
        document.getElementById('lab-difficulty').textContent = `难度: ${lab.difficulty}`;

        // Update lab description
        const descriptionContainer = document.getElementById('lab-description');
        descriptionContainer.innerHTML = this.generateLabContent(lab);
        
        // Scroll to top
        window.scrollTo(0, 0);

        // Add fade-in animation
        document.getElementById('content-area').classList.add('fade-in');
        setTimeout(() => {
            document.getElementById('content-area').classList.remove('fade-in');
        }, 300);
    }

    generateLabContent(lab) {
        return `
            <h2 class="text-xl font-semibold text-gray-900 mb-4">实验概述</h2>
            <p class="text-gray-600 mb-6">${lab.description}</p>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-3">学习目标</h3>
            <ul class="list-disc list-inside text-gray-600 mb-6 space-y-1">
                ${lab.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-3">前置条件</h3>
            <ul class="list-disc list-inside text-gray-600 mb-6 space-y-1">
                ${lab.prerequisites.map(req => `<li>${req}</li>`).join('')}
            </ul>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div class="flex items-start">
                    <i class="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
                    <div>
                        <h4 class="font-semibold text-yellow-800 mb-1">注意事项</h4>
                        <p class="text-yellow-700 text-sm">${lab.warning}</p>
                    </div>
                </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-3">实验步骤</h3>
            <div class="space-y-6">
                ${lab.steps.map((step, index) => `
                    <div class="flex items-start space-x-4">
                        <div class="step-indicator">${index + 1}</div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900 mb-2">${step.title}</h4>
                            <p class="text-gray-600 mb-3">${step.description}</p>
                            ${step.code ? `<pre><code>${step.code}</code></pre>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="font-semibold text-green-800 mb-2">🎉 恭喜完成实验！</h4>
                <p class="text-green-700 text-sm mb-3">您已成功完成本实验，掌握了相关的GenAI Well-Architected最佳实践。</p>
                <div class="flex space-x-4">
                    <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                        下载实验报告
                    </button>
                    <button class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 text-sm">
                        分享成果
                    </button>
                </div>
            </div>
        `;
    }

    initializeLabData() {
        return {
            // Operational Excellence Labs
            'op-1': {
                pillar: '卓越运营',
                title: '模型性能评估',
                duration: '45分钟',
                difficulty: '中级',
                description: '学习如何建立全面的GenAI模型性能评估体系，包括准确性、延迟、吞吐量和成本等关键指标的监控和评估。',
                objectives: [
                    '建立模型性能基准测试',
                    '配置实时性能监控',
                    '实现A/B测试框架',
                    '创建性能报告仪表板'
                ],
                prerequisites: [
                    'AWS账户和基础权限',
                    '了解SageMaker基础概念',
                    '机器学习基础知识'
                ],
                warning: '本实验会使用SageMaker资源，可能产生相应费用。',
                steps: [
                    {
                        title: '创建性能测试数据集',
                        description: '准备标准化的测试数据集，用于评估模型性能。'
                    },
                    {
                        title: '配置CloudWatch指标',
                        description: '设置自定义指标收集模型响应时间、准确性等关键数据。'
                    },
                    {
                        title: '实现自动化评估流程',
                        description: '使用AWS Step Functions创建自动化的模型性能评估流程。'
                    }
                ]
            },
            'op-2': {
                pillar: '卓越运营',
                title: '运营健康监控和管理',
                duration: '50分钟',
                difficulty: '中级',
                description: '学习如何建立全面的GenAI应用运营健康监控体系，包括系统状态、资源使用、错误率和用户体验等关键指标。',
                objectives: [
                    '建立健康检查机制',
                    '配置多维度监控指标',
                    '实现自动化告警和通知',
                    '创建运营仪表板'
                ],
                prerequisites: [
                    'AWS账户和基础权限',
                    '了解CloudWatch和X-Ray',
                    '系统运维基础知识'
                ],
                warning: '本实验会创建监控资源，可能产生少量费用。',
                steps: [
                    {
                        title: '设置应用健康检查',
                        description: '配置Application Load Balancer健康检查和自定义健康端点。'
                    },
                    {
                        title: '创建监控仪表板',
                        description: '使用CloudWatch Dashboard展示关键运营指标和趋势。'
                    }
                ]
            },
            // Security Labs
            'sec-1': {
                pillar: '安全性',
                title: '端点安全配置和管理',
                duration: '45分钟',
                difficulty: '中级',
                description: '学习如何为GenAI应用端点实施全面的安全防护措施，包括访问控制、数据加密和网络隔离。',
                objectives: [
                    '配置VPC端点安全',
                    '实现API端点认证',
                    '设置网络访问控制',
                    '配置传输加密'
                ],
                prerequisites: [
                    'AWS账户和网络权限',
                    '了解VPC和API Gateway',
                    '网络安全基础知识'
                ],
                warning: '请谨慎配置网络安全组，避免意外暴露服务。',
                steps: [
                    {
                        title: '创建VPC端点',
                        description: '为GenAI服务创建私有VPC端点，确保数据不经过公网。'
                    },
                    {
                        title: '配置安全组规则',
                        description: '设置精细的安全组规则，控制入站和出站流量。'
                    }
                ]
            },
            // Reliability Labs
            'rel-1': {
                pillar: '可靠性',
                title: '吞吐量配额管理和优化',
                duration: '40分钟',
                difficulty: '中级',
                description: '学习如何有效管理GenAI服务的吞吐量配额，包括配额监控、预警和自动调整策略。',
                objectives: [
                    '监控API调用配额',
                    '设置配额预警机制',
                    '实现流量控制策略',
                    '配置自动扩容机制'
                ],
                prerequisites: [
                    'AWS账户和基础权限',
                    '了解AWS服务配额',
                    'API管理基础知识'
                ],
                warning: '请合理设置配额阈值，避免服务中断。',
                steps: [
                    {
                        title: '配置配额监控',
                        description: '使用CloudWatch监控各项AWS服务的配额使用情况。'
                    },
                    {
                        title: '实现流量整形',
                        description: '配置API Gateway流量控制，平滑请求峰值。'
                    }
                ]
            },
            // Performance Efficiency Labs
            'perf-1': {
                pillar: '性能效率',
                title: '性能评估流程建立',
                duration: '55分钟',
                difficulty: '中级',
                description: '学习如何建立系统化的GenAI模型性能评估流程，包括基准测试、性能监控和优化建议。',
                objectives: [
                    '建立性能基准测试',
                    '配置持续性能监控',
                    '实现性能回归检测',
                    '创建优化建议系统'
                ],
                prerequisites: [
                    'AWS账户和基础权限',
                    '了解性能测试概念',
                    '机器学习基础知识'
                ],
                warning: '性能测试可能会产生较高的计算成本。',
                steps: [
                    {
                        title: '设计性能测试用例',
                        description: '创建全面的性能测试用例，覆盖各种使用场景。'
                    },
                    {
                        title: '配置自动化测试',
                        description: '使用AWS CodeBuild实现自动化性能测试流程。'
                    }
                ]
            },
            // Cost Optimization Labs
            'cost-1': {
                pillar: '成本优化',
                title: '模型选择和成本优化',
                duration: '50分钟',
                difficulty: '中级',
                description: '学习如何根据业务需求选择最适合的GenAI模型，并实现成本最优化的部署和运营策略。',
                objectives: [
                    '对比不同模型成本',
                    '实现模型性能成本分析',
                    '配置成本优化策略',
                    '建立成本监控体系'
                ],
                prerequisites: [
                    'AWS账户和计费权限',
                    '了解AWS定价模式',
                    '成本管理基础知识'
                ],
                warning: '请合理设置成本预警，避免意外费用。',
                steps: [
                    {
                        title: '模型成本对比分析',
                        description: '使用AWS Pricing Calculator对比不同模型的成本。'
                    },
                    {
                        title: '配置成本监控',
                        description: '设置Cost Explorer和Budgets监控和控制成本。'
                    }
                ]
            },
            // Sustainability Labs
            'sus-1': {
                pillar: '可持续性',
                title: '节能基础设施和服务优化',
                duration: '45分钟',
                difficulty: '中级',
                description: '学习如何选择和优化AWS基础设施和服务，以降低GenAI应用的能耗和环境影响。',
                objectives: [
                    '选择节能实例类型',
                    '优化资源利用率',
                    '配置自动关机策略',
                    '监控能耗指标'
                ],
                prerequisites: [
                    'AWS账户和基础权限',
                    '了解AWS实例类型',
                    '可持续性基础知识'
                ],
                warning: '请合理平衡性能和能耗需求。',
                steps: [
                    {
                        title: '选择Graviton处理器',
                        description: '使用AWS Graviton处理器实例降低能耗和成本。'
                    },
                    {
                        title: '配置智能调度',
                        description: '实现基于需求的资源自动调度和关机。'
                    }
                ]
            }
        };
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LabPlatform();
});