package next.school.cesar.projeto_m3.services;

import next.school.cesar.projeto_m3.dtos.EquipeDTO;
import next.school.cesar.projeto_m3.dtos.ProjetoDTO;
import next.school.cesar.projeto_m3.dtos.UsuarioDTO;
import next.school.cesar.projeto_m3.entities.Equipe;
import next.school.cesar.projeto_m3.entities.Projeto;
import next.school.cesar.projeto_m3.entities.Usuario;
import next.school.cesar.projeto_m3.repositories.EquipeRepository;
import next.school.cesar.projeto_m3.repositories.ProjetoRepository;
import next.school.cesar.projeto_m3.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjetoService {

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private EquipeRepository equipeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ProjetoDTO> getAllProjetos() {
        return projetoRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ProjetoDTO getProjetoById(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        return convertToDTO(projeto);
    }

    public ProjetoDTO getProjetoByMatricula(String matricula) {
        Projeto projeto = projetoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        return convertToDTO(projeto);
    }

    public List<Projeto> getProjetosByStatusProjeto(String statusProjeto) {
        if (!isValidStatus(statusProjeto)) {
            throw new IllegalArgumentException("Status Inválido " + statusProjeto);
        }
        return projetoRepository.findByStatusProjeto(statusProjeto);
    }

    public ProjetoDTO createProjeto(ProjetoDTO projetoDTO) {
        validarProjetoDTO(projetoDTO, true);

        Equipe equipe = findEquipeById(projetoDTO.getIdEquipe());
        Usuario gerente = findGerenteByMatricula(projetoDTO.getGerenteMatricula());

        validarGerenteNaEquipe(equipe, gerente);

        String flag = projetoDTO.getFlags() != null ? projetoDTO.getFlags().toLowerCase() : "cinza";
        String status = projetoDTO.getStatusProjeto() != null ? projetoDTO.getStatusProjeto().toLowerCase() : "em andamento";

        String matricula = generateUniqueMatricula(projetoDTO.getCentroCusto());

        Projeto projeto = Projeto.builder()
                .nome(projetoDTO.getNome())
                .dtInicio(projetoDTO.getDtInicio())
                .dtTerminoPrevista(projetoDTO.getDtTerminoPrevista())
                .statusProjeto(status)
                .orcamento(projetoDTO.getOrcamento())
                .descricao(projetoDTO.getDescricao())
                .flags(flag)
                .centroCusto(projetoDTO.getCentroCusto().toLowerCase())
                .matricula(matricula)
                .equipe(equipe)
                .idUsuario(gerente)
                .build();

        Projeto savedProjeto = projetoRepository.save(projeto);
        return convertToDTO(savedProjeto);
    }

    public ProjetoDTO updateProjeto(Long id, ProjetoDTO projetoDTO) {
        validarProjetoDTO(projetoDTO, false);

        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        Equipe equipe = findEquipeById(projetoDTO.getIdEquipe());
        Usuario gerente = findGerenteByMatricula(projetoDTO.getGerenteMatricula());

        validarGerenteNaEquipe(equipe, gerente);

        String flag = projetoDTO.getFlags() != null ? projetoDTO.getFlags().toLowerCase() : "cinza";
        String status = projetoDTO.getStatusProjeto() != null ? projetoDTO.getStatusProjeto().toLowerCase() : "em andamento";

        projeto.setNome(projetoDTO.getNome());
        projeto.setDtInicio(projetoDTO.getDtInicio());
        projeto.setDtTerminoPrevista(projetoDTO.getDtTerminoPrevista());
        projeto.setStatusProjeto(status);
        projeto.setOrcamento(projetoDTO.getOrcamento());
        projeto.setDescricao(projetoDTO.getDescricao());
        projeto.setFlags(flag);
        projeto.setCentroCusto(projetoDTO.getCentroCusto().toLowerCase());
        projeto.setEquipe(equipe);
        projeto.setIdUsuario(gerente);

        Projeto updatedProjeto = projetoRepository.save(projeto);
        return convertToDTO(updatedProjeto);
    }

    public boolean deleteProjeto(Long id) {
        if (projetoRepository.existsById(id)) {
            projetoRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    private ProjetoDTO convertToDTO(Projeto projeto) {
        Equipe equipe = projeto.getEquipe();

        List<UsuarioDTO> usuarios = equipe.getUsuarios().stream()
                .map(usuario -> UsuarioDTO.builder()
                        .matricula(usuario.getMatricula())
                        .nome(usuario.getNome())
                        .email(usuario.getEmail())
                        .centroCusto(usuario.getCentroCusto())
                        .statusUsuarioDescricao(usuario.getStatusUsuarioDescricao())
                        .build())
                .collect(Collectors.toList());

        EquipeDTO equipeDTO = EquipeDTO.builder()
                .idEquipe(equipe.getIdEquipe())
                .nome(equipe.getNome())
                .descricao(equipe.getDescricao())
                .usuarios(usuarios)
                .build();

        return ProjetoDTO.builder()
                .idProjeto(projeto.getIdProjeto())
                .matricula(projeto.getMatricula())
                .nome(projeto.getNome())
                .dtInicio(projeto.getDtInicio())
                .dtTerminoPrevista(projeto.getDtTerminoPrevista())
                .statusProjeto(projeto.getStatusProjeto())
                .orcamento(projeto.getOrcamento())
                .descricao(projeto.getDescricao())
                .flags(projeto.getFlags())
                .centroCusto(projeto.getCentroCusto())
                .gerenteMatricula(projeto.getIdUsuario().getMatricula())
                .idEquipe(equipe.getIdEquipe()) 
                .equipe(equipeDTO) 
                .build();
    }

    private String generateUniqueMatricula(String centroCusto) {
        int anoAtual = java.time.Year.now().getValue();
        int mesAtual = java.time.LocalDate.now().getMonthValue();
        long contador = usuarioRepository.countByCentroCusto(centroCusto) + 1;
        String baseMatricula = String.format("%02d%02d%04d", anoAtual % 100, mesAtual, contador);
        String matricula = baseMatricula;

        while (projetoRepository.existsByMatricula(matricula)) {
            contador++;
            matricula = String.format("%02d%02d%04d", anoAtual % 100, mesAtual, contador);
        }
        return matricula;
    }

    private void validarProjetoDTO(ProjetoDTO projetoDTO, boolean isNew) {
        if (projetoDTO.getNome() == null || projetoDTO.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome do projeto não pode ser nulo ou vazio");
        }
        if (projetoDTO.getCentroCusto() == null || projetoDTO.getCentroCusto().trim().isEmpty()) {
            throw new RuntimeException("Centro de custo não pode ser nulo ou vazio");
        }
        if (projetoDTO.getGerenteMatricula() == null || projetoDTO.getGerenteMatricula().trim().isEmpty()) {
            throw new RuntimeException("Matrícula do gerente não pode ser nula ou vazia");
        }
        if (projetoDTO.getIdEquipe() == null) {
            throw new RuntimeException("ID da equipe não pode ser nulo");
        }
        if (projetoDTO.getDtInicio() == null) {
            throw new RuntimeException("Data de início do projeto não pode ser nula");
        }
        if (projetoDTO.getDtTerminoPrevista() == null) {
            throw new RuntimeException("Data de término prevista do projeto não pode ser nula");
        }

        if (isNew) {
            // Definindo o fuso horário de Brasília
            ZoneId zoneId = ZoneId.of("America/Sao_Paulo");
            LocalDate hoje = LocalDate.now(zoneId);
            LocalDate cincoAnosFuturo = hoje.plusYears(5);

            // Converte java.util.Date para LocalDate no fuso horário de Brasília
            Instant inicioInstant = projetoDTO.getDtInicio().toInstant();
            Instant terminoInstant = projetoDTO.getDtTerminoPrevista().toInstant();

            LocalDate dtInicio = inicioInstant.atZone(zoneId).toLocalDate();
            LocalDate dtTerminoPrevista = terminoInstant.atZone(zoneId).toLocalDate();

            // Ajuste de hora para a data de hoje
            if (dtInicio.equals(hoje)) {
                ZonedDateTime agora = ZonedDateTime.now(zoneId);
                projetoDTO.setDtInicio(Date.from(agora.toInstant()));
                dtInicio = agora.toLocalDate();
            }

            // Comparação de datas
            if (dtInicio.isBefore(hoje) || dtInicio.isAfter(cincoAnosFuturo)) {
                throw new RuntimeException("Data de início do projeto deve ser hoje ou até cinco anos no futuro. Data fornecida: " + dtInicio);
            }

            if (dtTerminoPrevista.isBefore(dtInicio)) {
                throw new RuntimeException("Data de término não pode ser menor que a data de início. Data de término fornecida: " + dtTerminoPrevista);
            }

            LocalDate cincoAnosAposInicio = dtInicio.plusYears(5);

            if (dtTerminoPrevista.isAfter(cincoAnosAposInicio)) {
                throw new RuntimeException("Data de término não pode ser superior a cinco anos a partir da data de início. Data de término fornecida: " + dtTerminoPrevista);
            }
        }

        Equipe equipe = findEquipeById(projetoDTO.getIdEquipe());
        Usuario gerente = findGerenteByMatricula(projetoDTO.getGerenteMatricula());

        validarCentroCusto(projetoDTO.getCentroCusto().toLowerCase());
        validarGerenteNaEquipe(equipe, gerente);
        validarFlag(projetoDTO.getFlags() != null ? projetoDTO.getFlags().toLowerCase() : "cinza");
        validarStatus(projetoDTO.getStatusProjeto() != null ? projetoDTO.getStatusProjeto().toLowerCase() : "em andamento");
    }

    private Equipe findEquipeById(Long idEquipe) {
        return equipeRepository.findById(idEquipe)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));
    }

    private Usuario findGerenteByMatricula(String matricula) {
        return usuarioRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));
    }

    private void validarGerenteNaEquipe(Equipe equipe, Usuario gerente) {
        if (!equipe.getUsuarios().contains(gerente)) {
            throw new RuntimeException("Gerente não pertence à equipe");
        }
    }

    private boolean isValidStatus(String status) {
        return "não iniciado".equalsIgnoreCase(status) || "em andamento".equalsIgnoreCase(status)
                || "concluído".equalsIgnoreCase(status) || "em espera".equalsIgnoreCase(status)
                || "cancelado".equals(status) || "atrasado".equals(status)
                || "revisão".equals(status) || "fechado".equals(status);
    }

    private void validarFlag(String flag) {
        List<String> allowedFlags = Arrays.asList("verde", "amarelo", "vermelho", "azul", "cinza", "laranja");
        if (!allowedFlags.contains(flag.toLowerCase())) {
            throw new RuntimeException("Flag inválida. As flags válidas são: verde, amarelo, vermelho, azul, cinza, laranja");
        }
    }

    private void validarStatus(String status) {
        List<String> allowedStatus = Arrays.asList("não iniciado", "em andamento", "concluído", "em espera",
                "cancelado", "atrasado", "revisão", "fechado");
        if (!allowedStatus.contains(status.toLowerCase())) {
            throw new RuntimeException("Status inválido. Os status válidos são: não iniciado, em andamento, concluído, em espera, cancelado, atrasado, revisão, fechado");
        }
    }
    
    private void validarCentroCusto(String centroCusto) {
        List<String> validCentrosCusto = Arrays.asList(
            "desenvolvimento", "arquitetura", "engenharia", "operação", 
            "design", "projeto", "dados", "financeiro", "ti", "rh"
        );

        if (!validCentrosCusto.contains(centroCusto.toLowerCase())) {
            throw new RuntimeException("Centro de custo inválido. Válidos: " + String.join(", ", validCentrosCusto));
        }
    }
    
    public List<ProjetoDTO> getProjetosByCriteria(String status, String gerenteMatricula, String nome, String centroCusto, Date dtInicio, Date dtTerminoPrevista, Integer mesInicio, Integer anoInicio, Integer mesTermino, Integer anoTermino, Double orcamento, String flags, String matricula, String descricao) {
        
        if (mesInicio != null && anoInicio != null) {
            dtInicio = Date.from(LocalDate.of(anoInicio, mesInicio, 1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
        if (mesTermino != null && anoTermino != null) {
            LocalDate endDate = LocalDate.of(anoTermino, mesTermino, 1).withDayOfMonth(LocalDate.of(anoTermino, mesTermino, 1).lengthOfMonth());
            dtTerminoPrevista = Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
        
        List<Projeto> projetos = projetoRepository.findProjetosByMultipleCriteria(status, gerenteMatricula, nome, centroCusto, dtInicio, dtTerminoPrevista, orcamento, flags, matricula, descricao);
        return projetos.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}
