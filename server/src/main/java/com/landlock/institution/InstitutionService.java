package com.landlock.institution;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InstitutionService {

    private final InstitutionRepository institutionRepository;

    @Transactional(readOnly = true)
    public List<InstitutionDTO> getAllInstitutions() {
        return institutionRepository.findAll().stream()
                .map(InstitutionDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public InstitutionDTO getInstitutionById(UUID id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Institution not found with id: " + id));
        return InstitutionDTO.fromEntity(institution);
    }

    @Transactional
    public InstitutionDTO createInstitution(InstitutionDTO dto) {
        Institution institution = Institution.builder()
                .name(dto.name())
                .institutionType(dto.institutionType())
                .externalReference(dto.externalReference())
                .status(dto.status() != null ? dto.status() : "ACTIVE")
                .build();
        Institution saved = institutionRepository.save(institution);
        return InstitutionDTO.fromEntity(saved);
    }
}
