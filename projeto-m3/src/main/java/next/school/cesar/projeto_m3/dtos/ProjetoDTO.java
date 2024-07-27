package next.school.cesar.projeto_m3.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjetoDTO {
    private Long idProjeto;
    private String nome;
    private String matricula;
    private double orcamento;
    private String centroCusto;
    private Date dtInicio;
    private Date dtTerminoPrevista;
    private String descricao;
    private String statusProjeto;
    private String flags;
    private Long idEquipe;
    private String gerenteMatricula;
    private EquipeDTO equipe; 
}
