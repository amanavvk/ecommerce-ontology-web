'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface ProductionData {
  machine: string;
  status: string;
  efficiency: number;
  output: number;
  uptime: string;
}

export default function ManufacturingAnalytics() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setMetrics([
        {
          title: 'Total Production',
          value: '8,429 units',
          change: '+12.5%',
          icon: '📦',
          color: '#059669',
          bgColor: '#ecfdf5'
        },
        {
          title: 'Machine Efficiency',
          value: '94.2%',
          change: '+3.1%',
          icon: '⚙️',
          color: '#0284c7',
          bgColor: '#e0f2fe'
        },
        {
          title: 'Quality Score',
          value: '98.7%',
          change: '+1.8%',
          icon: '✅',
          color: '#7c3aed',
          bgColor: '#ede9fe'
        },
        {
          title: 'Downtime',
          value: '2.3 hrs',
          change: '-45.2%',
          icon: '⏱️',
          color: '#dc2626',
          bgColor: '#fef2f2'
        }
      ]);

      setProductionData([
        { machine: 'CNC-Mill-001', status: 'Active', efficiency: 96.5, output: 1240, uptime: '98.2%' },
        { machine: 'Assembly-Line-A', status: 'Active', efficiency: 94.1, output: 2150, uptime: '95.8%' },
        { machine: 'Welding-Station-03', status: 'Maintenance', efficiency: 0, output: 0, uptime: '0%' },
        { machine: 'Quality-Check-02', status: 'Active', efficiency: 98.3, output: 890, uptime: '99.1%' },
        { machine: 'Packaging-Unit-B', status: 'Active', efficiency: 92.7, output: 1580, uptime: '94.3%' }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div style={{ fontSize: '18px', color: '#0c4a6e' }}>Loading Analytics Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)',
      padding: '40px 20px'
    }}>
      <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <div className="card" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#0c4a6e',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              margin: 0
            }}>
              📊 Manufacturing Analytics Dashboard
            </h1>
            <button 
              className="btn"
              style={{ background: '#64748b', color: 'white' }}
              onClick={() => router.push('/manufacturing')}
            >
              ← Back to Manufacturing
            </button>
          </div>
          
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '32px',
            border: '2px solid #0ea5e9',
            textAlign: 'left'
          }}>
            {/* Key Metrics */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '20px' }}>
                🎯 Key Performance Indicators
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '16px'
              }}>
                {metrics.map((metric, index) => (
                  <div 
                    key={index}
                    className="card" 
                    style={{ 
                      background: metric.bgColor, 
                      border: `2px solid ${metric.color}`,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{metric.icon}</div>
                    <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      {metric.title}
                    </h3>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: metric.color, marginBottom: '4px' }}>
                      {metric.value}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: metric.change.startsWith('+') ? '#059669' : '#dc2626',
                      fontWeight: 'bold'
                    }}>
                      {metric.change} from last week
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Overview */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '20px' }}>
                🏭 Real-Time Production Status
              </h2>
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: '16px',
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  <div>Machine</div>
                  <div>Status</div>
                  <div>Efficiency</div>
                  <div>Output</div>
                  <div>Uptime</div>
                </div>
                {productionData.map((item, index) => (
                  <div 
                    key={index}
                    style={{ 
                      padding: '16px',
                      borderBottom: index < productionData.length - 1 ? '1px solid #e5e7eb' : 'none',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                      gap: '16px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#374151' }}>{item.machine}</div>
                    <div>
                      <span style={{ 
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: item.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                        color: item.status === 'Active' ? '#059669' : '#dc2626'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ color: '#374151' }}>{item.efficiency}%</div>
                    <div style={{ color: '#374151' }}>{item.output} units</div>
                    <div style={{ color: '#374151' }}>{item.uptime}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Charts */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '20px' }}>
                📈 Production Trends
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '20px'
              }}>
                <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0ea5e9' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                    📊 Weekly Production Volume
                  </h3>
                  <div style={{ 
                    height: '200px', 
                    background: 'white', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
                      <div>Interactive chart would be displayed here</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        (Chart.js or D3.js integration)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '16px' }}>
                    ⚡ Machine Efficiency Trends
                  </h3>
                  <div style={{ 
                    height: '200px', 
                    background: 'white', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
                      <div>Real-time efficiency monitoring</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        (Live data visualization)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px'
              }}>
                <button 
                  className="btn btn-primary"
                  style={{ background: '#0ea5e9' }}
                  onClick={() => router.push('/manufacturing/queries')}
                >
                  🔍 Run SPARQL Queries
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ background: '#10b981' }}
                  onClick={() => router.push('/manufacturing/validation')}
                >
                  🔧 Validate Data
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ background: '#8b5cf6' }}
                  onClick={() => router.push('/data-upload')}
                >
                  📤 Upload Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
