export default (props) => {
   
    let mat = [];
    for (let i = 0; i < 20; i++) {
        let row = [];
        for (let j = 0; j < 20; j++) {
            row.push(props.weightMatrix[j + (i*20)]);
        }
        mat.push(row);
    }

    // function getRedWeight(weight) {
    //     return ();
    // }

    return (
        <div>
            <table id="heatmap-table" class="heatmap-table">
                {mat.map((row, index) => 
                    <tr key={index}>
                        {row.map((weight, indix) => 
                            <td key={indix} style={`background-color:rgba(${Math.floor(255*weight)}, 0, 0, 0.5)`}></td>
                        )}
                    </tr>
                )}
            </table>
        </div>
    )
}
