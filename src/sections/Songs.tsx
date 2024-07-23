
function Songs() {
    return (
        <div className="w-full max-w-96">
          <h2 className="text-lg font-bold text-myprim-600">Canciones</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-myprim-200 text-myprim-900">
                  <th className="px-4 py-2 text-center font-normal">#</th>
                  <th className="px-4 py-2 text-center font-normal">Nombre</th>
                  <th className="px-4 py-2 text-center font-normal">Duración</th>
                  <th className="px-4 py-2 text-center font-normal">Op</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold">
                  <td className="px-4 py-2 text-center text-mydark-50 font-light">1</td>
                  <td className="px-4 py-2 text-center text-mydark-500">Nose</td>
                  <td className="px-4 py-2 text-center text-mydark-50 font-normal">1:58</td>
                  <td className="px-4 py-2 text-center">Icons</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default Songs