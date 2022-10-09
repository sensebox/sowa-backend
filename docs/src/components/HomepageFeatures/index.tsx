import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Img: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'SENPH Ontology',
    Img: './img/SENPHOntology_Logo.png',
    description: (
      <>
        This API offers a wiki to create and access crowd sourced explicit information
        about instances of sensors, phenomena, devices, domains and units.
      </>
    ),
  },
];

// function Feature({Img, description}: FeatureItem) {
//   return (
//     <div className={clsx('col col--7')}>
//       <div className="text--center">
//         <img src={Img}  />
//       </div>
//       <div className="text--center padding-horiz--md">
//         <p>{description}</p>
//       </div>
//     </div>
//   );
// }

// export default function HomepageFeatures(): JSX.Element {
//   return (
//     <section className={styles.features}>
//       <div className="container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
//         <div className="row">
//           {FeatureList.map((props, idx) => (
//             <Feature key={idx} {...props} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <div className={clsx('col col--8')}>
          <div className="text--center">
            <img src='./img/SENPHOntology_Logo.png'/>
          </div>
          <div className="text--center padding-horiz--md">
            <p>
              This API offers a wiki to create and access crowd sourced explicit information
              about instances of sensors, phenomena, devices, domains and units.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
