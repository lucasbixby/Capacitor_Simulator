// to run the program use "npm start" in the terminal within the current directory 

import React, { useState, useEffect } from 'react';

const EPSILON_0 = 8.85e-12; // C^2 / (N·m^2)
const NUM_ELECTRONS = 10;

const unitToMeters = {
  cm: 0.01,
  mm: 0.001,
  nm: 1e-9,
};

const CapacitorSimulation = () => {
  const [voltage, setVoltage] = useState(10);
  const [maxDistance, setMaxDistance] = useState(50); // in selected unit
  const [distance, setDistance] = useState(10);        // in selected unit
  const [sideLengthCm, setSideLengthCm] = useState(10); // cm // updated to m
  const [unit, setUnit] = useState<'cm' | 'mm' | 'nm'>('cm');
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [electronPositions, setElectronPositions] = useState(
    Array.from({ length: NUM_ELECTRONS }, () => Math.random())
  );

  // computed values
  const conversionFactor = unitToMeters[unit];
  const distanceMeters = distance * conversionFactor;
  const maxDistanceMeters = maxDistance * conversionFactor;
  const sideLength = sideLengthCm ; // convert cm to m // updated to m
  const area = sideLength ** 2;
  const electricField = voltage / distanceMeters;
  const capacitance = (EPSILON_0 * area) / distanceMeters;
  const charge = capacitance * voltage;

  useEffect(() => {
    const interval = setInterval(() => {
      setElectronPositions((positions) =>
        positions.map((p) => (p + 0.01) % 1)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = parseFloat(e.target.value);
    setDistance(newDistance > 0 ? newDistance : 0.1);
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(parseFloat(e.target.value));
  };

  const handleMaxDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMaxDistance(val > 0 ? val : 1);
    if (distance > val) setDistance(val);
  };

  const handleSideLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSideLengthCm(val > 0 ? val : 0.1);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as 'cm' | 'mm' | 'nm';
    const toMetersOld = unitToMeters[unit];
    const toMetersNew = unitToMeters[newUnit];
    setDistance(distance * toMetersOld / toMetersNew);
    setMaxDistance(maxDistance * toMetersOld / toMetersNew);
    setUnit(newUnit);
  };

  const plateWidth = 60;
  const containerPadding = 40;
  const normalizedGapRatio = distance / maxDistance;
  const visualGap = `calc(min(100vw - ${2 * (plateWidth + containerPadding)}px, 800px - ${2 * plateWidth}px) * ${normalizedGapRatio})`;

  const fieldLines = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', borderStyle: 'outset', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
      <h1 style={{ borderStyle: 'outset', borderWidth: '5px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)'}}>
        Parallel Plate Capacitor Simulation
      </h1>

      <label>
        Voltage (ΔV):
        <input
          type="number"
          value={voltage}
          onChange={handleVoltageChange}
          step="1"
          style={{ marginLeft: '1rem' , backgroundColor: 'rgba(43, 64, 99, 0.25)'}}
        />
        {' V'}
      </label>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Max Distance between plates:
          <input
            type="number"
            value={maxDistance}
            onChange={handleMaxDistanceChange}
            step="1"
            style={{ marginLeft: '1rem', backgroundColor: 'rgba(43, 64, 99, 0.25)' }}
          />
          <select value={unit} onChange={handleUnitChange} style={{ marginLeft: '1rem' }}>
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="nm">nm</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Plate Side Length:
          <input
            type="number"
            value={sideLengthCm}
            onChange={handleSideLengthChange}
            step="0.1"
            style={{ marginLeft: '1rem', backgroundColor: 'rgba(43, 64, 99, 0.25)' }}
          />
          {' m'}
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Show Electric Field Lines:
          <input
            type="checkbox"
            checked={showFieldLines}
            onChange={() => setShowFieldLines(!showFieldLines)}
            style={{ marginLeft: '1rem' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label>
          Distance between plates (d): {distance.toFixed(1)} {unit}
          <input
            type="range"
            min="0.1"
            max={maxDistance}
            step="0.1"
            value={distance}
            onChange={handleDistanceChange}
            style={{ display: 'block', width: '100%' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <strong>Electric Field:</strong> {electricField.toFixed(2)} V/m<br />
        <strong>Capacitance:</strong> {capacitance.toExponential(3)} F<br />
        <strong>Charge:</strong> {charge.toExponential(3)} C<br />
        <strong>Plate Area:</strong> {area.toFixed(6)} m²
      </div>

      <div style={{
        marginTop: '3rem',
        marginBottom: '3rem',
        height: '200px',
        width: '100%',
        border: '1px solid #ccc',
        borderStyle: 'inset',
        borderWidth: '5px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgba(43, 64, 99, 0.25)'
      }}>
        {showFieldLines && fieldLines.map((line, idx) => (
          <div key={idx} style={{
            position: 'absolute',
            top: `${(idx + 1) * 30}px`,
            left: `calc(50% - (${visualGap}) / 2)`,
            width: `${visualGap}`,
            height: '2px',
            backgroundColor: '#888'
          }} />
        ))}

        {showFieldLines && electronPositions.map((p, i) => (
          <div key={`e-${i}`} style={{
            position: 'absolute',
            top: `${30 + (i % 5) * 30}px`,
            left: `calc(50% - (${visualGap}) / 2 + (${visualGap} - 10px) * ${p})`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'cyan'
          }} />
        ))}

        <div style={{
          backgroundColor: '#d00',
          color: 'white',
          height: '190px',
          width: `${plateWidth}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: `calc(50% - (${visualGap}) / 2 - ${plateWidth}px)`,
          transform: 'translateY(-50%)',
          transition: 'left 0.2s ease'
        }}>+ Plate</div>

        <div style={{
          backgroundColor: '#00d',
          color: 'white',
          height: '190px',
          width: `${plateWidth}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: `calc(50% + (${visualGap}) / 2)`,
          transform: 'translateY(-50%)',
          transition: 'left 0.2s ease'
        }}>- Plate</div>
      </div>

      <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
        * Inputs for distance can be in cm, mm, or nm; calculations are done in meters.
      </div>
    </div>
  );
};

export default CapacitorSimulation;
