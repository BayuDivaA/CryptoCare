import React, { useState } from "react";
import team1 from "../../images/team-1.png";
import team2 from "../../images/team-2.png";
import team3 from "../../images/team-3.png";
import team4 from "../../images/team-4.png";
import bg3d from "../../images/bg-3d.jpg";
import fallbackProfile from "../../images/LogoOnly.png";

function CardTeam({ image, name, text }) {
  const [currentImage, setCurrentImage] = useState(image);
  const [failedOnce, setFailedOnce] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1">
      <div className="flex w-full justify-center bg-blue-50 py-4">
        <img
          className="h-28 w-28 rounded-full object-cover ring-4 ring-white"
          src={currentImage}
          alt={`Team member ${name}`}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (failedOnce) return;
            setFailedOnce(true);
            setCurrentImage(fallbackProfile);
          }}
        />
      </div>
      <div className="px-6 py-4 text-center">
        <div className="mb-2 text-lg font-bold">{name}</div>
        <p className="text-sm text-gray-700">{text}</p>
      </div>
      <div className="flex px-6 pb-2 justify-center gap-2">
        <button className="bg-blue-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
          <svg className="w-5 h-5 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </button>
        <button className="bg-red-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
          <svg className="w-5 h-5 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        </button>
        <button className="bg-blue-600 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
          <svg className="w-5 h-5 fill-current" role="img" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M218.123122,218.127392 L180.191928,218.127392 L180.191928,158.724263 C180.191928,144.559023 179.939053,126.323993 160.463756,126.323993 C140.707926,126.323993 137.685284,141.757585 137.685284,157.692986 L137.685284,218.123441 L99.7540894,218.123441 L99.7540894,95.9665207 L136.168036,95.9665207 L136.168036,112.660562 L136.677736,112.660562 C144.102746,99.9650027 157.908637,92.3824528 172.605689,92.9280076 C211.050535,92.9280076 218.138927,118.216023 218.138927,151.114151 L218.123122,218.127392 Z M56.9550587,79.2685282 C44.7981969,79.2707099 34.9413443,69.4171797 34.9391618,57.260052 C34.93698,45.1029244 44.7902948,35.2458562 56.9471566,35.2436736 C69.1040185,35.2414916 78.9608713,45.0950217 78.963054,57.2521493 C78.9641017,63.090208 76.6459976,68.6895714 72.5186979,72.8184433 C68.3913982,76.9473153 62.7929898,79.26748 56.9550587,79.2685282 M75.9206558,218.127392 L37.94995,218.127392 L37.94995,95.9665207 L75.9206558,95.9665207 L75.9206558,218.127392 Z M237.033403,0.0182577091 L18.8895249,0.0182577091 C8.57959469,-0.0980923971 0.124827038,8.16056231 -0.001,18.4706066 L-0.001,237.524091 C0.120519052,247.839103 8.57460631,256.105934 18.8895249,255.9977 L237.033403,255.9977 C247.368728,256.125818 255.855922,247.859464 255.999,237.524091 L255.999,18.4548016 C255.851624,8.12438979 247.363742,-0.133792868 237.033403,0.000790807055"></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

const Team = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10 sm:px-6" style={{ backgroundImage: `url(${bg3d})` }}>
      <div className="w-full max-w-6xl py-7">
        <p className="mb-10 text-center text-2xl font-bold text-blue-gray-900 sm:text-4xl">The Team</p>
        <div className="flex justify-center ">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CardTeam image={team1} name="BAYU" text="FOUNDER" />
            <CardTeam image={team2} name="BY YOU" text="Front-End Developer" />
            <CardTeam image={team3} name="BY U" text="Back-End Developer" />
            <CardTeam image={team4} name="BYU" text="Blockchain Developer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
